// index.js
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB URI (use DB_USER and DB_PASS or full URI env) ---
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const MONGO_URI = process.env.MONGODB_URI || `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.vmnz1az.mongodb.net/?retryWrites=true&w=majority`;

// Mongo client
const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;
let productsCollection;
let addreviewCollection;
let usersCollection;
let favoritesCollection;
let isConnected = false;

// Initialize DB once
async function initDB() {
  if (isConnected) return;
  await client.connect();
  db = client.db('food_db');
  productsCollection = db.collection('products');
  addreviewCollection = db.collection('addreview');
  usersCollection = db.collection('users');
  favoritesCollection = db.collection('favorites');
  isConnected = true;
  console.log('MongoDB connected (initDB)');
}

// Middleware to ensure DB ready
async function ensureDB(req, res, next) {
  try {
    await initDB();
    next();
  } catch (err) {
    console.error('DB init error:', err);
    res.status(500).send({ error: 'Database connection error' });
  }
}

// Use middleware for all routes
app.use(ensureDB);

// --- Routes ---

app.get('/', (req, res) => res.send('Hello from Food API!'));

// Users
app.post('/users', async (req, res) => {
  try {
    const newUser = req.body;
    const existingUser = await usersCollection.findOne({ email: newUser.email });
    if (existingUser) return res.send({ message: 'User already exists' });
    const result = await usersCollection.insertOne(newUser);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

// Products
app.get('/products', async (req, res) => {
  try {
    const result = await productsCollection.find().toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });
    if (!product) return res.status(404).send({ message: 'Product not found' });
    res.send(product);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const newProduct = req.body;
    const result = await productsCollection.insertOne(newProduct);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

app.patch('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateProduct = req.body;
    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateProduct }
    );
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const result = await productsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

// Reviews
app.get('/addreview', async (req, res) => {
  try {
    const email = req.query.email;
    const query = email ? { email } : {};
    const result = await addreviewCollection.find(query).sort({ createdAt: -1 }).toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

app.get('/addreview/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const review = await addreviewCollection.findOne({ _id: new ObjectId(id) });
    if (!review) return res.status(404).send({ message: 'Review not found' });
    res.send(review);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

app.post('/addreview', async (req, res) => {
  try {
    const newReview = { ...req.body, createdAt: new Date() };
    const result = await addreviewCollection.insertOne(newReview);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

app.put('/addreview/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateDoc = { $set: req.body };
    const result = await addreviewCollection.updateOne({ _id: new ObjectId(id) }, updateDoc);
    if (result.matchedCount > 0) {
      res.send({ success: true, message: 'Review updated successfully' });
    } else {
      res.send({ success: false, message: 'Review not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: 'Server error' });
  }
});

app.delete('/addreview/:id', async (req, res) => {
  try {
    const result = await addreviewCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send({ success: result.deletedCount > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

// Favorites
app.get('/favorites', async (req, res) => {
  try {
    const email = req.query.email;
    const favorites = await favoritesCollection.find({ userEmail: email }).toArray();
    res.send(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

app.post('/favorites', async (req, res) => {
  try {
    const favorite = req.body;
    const exists = await favoritesCollection.findOne({ userEmail: favorite.userEmail, foodId: favorite.foodId });
    if (exists) return res.send({ success: false, message: 'Already in favorites' });
    const result = await favoritesCollection.insertOne(favorite);
    res.send({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

app.delete('/favorites/:id', async (req, res) => {
  try {
    const result = await favoritesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send({ success: result.deletedCount > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

// Export app for Vercel / serverless Node
module.exports = app;
