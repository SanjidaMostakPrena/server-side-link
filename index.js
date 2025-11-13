const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = "mongodb+srv://fooddbUser:4Iy3vB7liNQpBJGq@cluster0.vmnz1az.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db('food_db');

    const productsCollection = db.collection('products');
    const addreviewCollection = db.collection('addreview');
    const usersCollection = db.collection('users');
    const favoritesCollection = db.collection('favorites');


    app.get('/', (req, res) => res.send('Hello World!'));

    //  Users
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const existingUser = await usersCollection.findOne({ email: newUser.email });
      if (existingUser) return res.send({ message: 'User already exists' });
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // Products
    app.get('/products', async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
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
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    app.patch('/products/:id', async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const result = await productsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateProduct }
      );
      res.send(result);
    });

    app.delete('/products/:id', async (req, res) => {
      const result = await productsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    });

    //Reviews
    app.get('/addreview', async (req, res) => {
      const email = req.query.email;
      const query = email ? { email } : {};
      const result = await addreviewCollection.find(query).sort({ createdAt: -1 }).toArray();
      res.send(result);
    });

    app.post('/addreview', async (req, res) => {
      const newReview = { ...req.body, createdAt: new Date() };
      const result = await addreviewCollection.insertOne(newReview);
      res.send(result);
    });

    app.put('/addreview/:id', async (req, res) => {
      const id = req.params.id;
      const updateDoc = { $set: req.body };
      const result = await addreviewCollection.updateOne({ _id: new ObjectId(id) }, updateDoc);
      res.send(result);
    });

    app.delete('/addreview/:id', async (req, res) => {
      const result = await addreviewCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send({ success: result.deletedCount > 0 });
    });

    // Favorites
    app.get('/favorites', async (req, res) => {
      const email = req.query.email;
      const favorites = await favoritesCollection.find({ userEmail: email }).toArray();
      res.send(favorites);
    });

    app.post('/favorites', async (req, res) => {
      const favorite = req.body;
      const exists = await favoritesCollection.findOne({ userEmail: favorite.userEmail, foodId: favorite.foodId });
      if (exists) return res.send({ success: false, message: "Already in favorites" });
      const result = await favoritesCollection.insertOne(favorite);
      res.send({ success: true, result });
    });

    app.delete('/favorites/:id', async (req, res) => {
      const result = await favoritesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send({ success: result.deletedCount > 0 });
    });


// Server-side search for reviews.........
app.get("/reviews", async (req, res) => {
  const search = req.query.search || ""; 
  const query = { foodName: { $regex: search, $options: "i" } }; 

  try {
    const reviews = await addreviewCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    res.send(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error while searching reviews" });
  }
});




    console.log("Connected to MongoDB successfully!");
  } finally {
    // await client.close(); 
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`Server running on port ${port}`));
