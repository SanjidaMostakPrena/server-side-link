// const express = require('express');
// const cors = require('cors');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// const app = express();
// const port = process.env.PORT || 3000;

// // index.js
// const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString("utf8");
// const serviceAccount = JSON.parse(decoded);
// const options = new FirebaseOptions.Builder()
//   .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//   .build();

// FirebaseApp.initializeApp(options);

// app.use(cors());
// app.use(express.json());



// // MongoDB URI
// const uri = "mongodb+srv://fooddbUser:4Iy3vB7liNQpBJGq@cluster0.vmnz1az.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // await client.connect();
//     const db = client.db('food_db');

//     const productsCollection = db.collection('products');
//     const addreviewCollection = db.collection('addreview');
//     const usersCollection = db.collection('users');
//     const favoritesCollection = db.collection('favorites');

//     app.get('/', (req, res) => res.send('Hello World!'));

//     // ---------------- Users ----------------
//     app.post('/users', async (req, res) => {
//       const newUser = req.body;
//       const existingUser = await usersCollection.findOne({ email: newUser.email });
//       if (existingUser) return res.send({ message: 'User already exists' });
//       const result = await usersCollection.insertOne(newUser);
//       res.send(result);
//     });

//     // ---------------- Products ----------------
//     app.get('/products', async (req, res) => {
//       const result = await productsCollection.find().toArray();
//       res.send(result);
//     });

//     app.get('/products/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const product = await productsCollection.findOne({ _id: new ObjectId(id) });
//         if (!product) return res.status(404).send({ message: 'Product not found' });
//         res.send(product);
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Server error' });
//       }
//     });

//     app.post('/products', async (req, res) => {
//       const newProduct = req.body;
//       const result = await productsCollection.insertOne(newProduct);
//       res.send(result);
//     });

//     app.patch('/products/:id', async (req, res) => {
//       const id = req.params.id;
//       const updateProduct = req.body;
//       const result = await productsCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: updateProduct }
//       );
//       res.send(result);
//     });

//     app.delete('/products/:id', async (req, res) => {
//       const result = await productsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
//       res.send(result);
//     });

//     // ---------------- Reviews ----------------
//     // Get all reviews (optionally by email)
//     app.get('/addreview', async (req, res) => {
//       const email = req.query.email;
//       const query = email ? { email } : {};
//       const result = await addreviewCollection.find(query).sort({ createdAt: -1 }).toArray();
//       res.send(result);
//     });

//     // Get a single review by ID
//     app.get('/addreview/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const review = await addreviewCollection.findOne({ _id: new ObjectId(id) });
//         if (!review) return res.status(404).send({ message: 'Review not found' });
//         res.send(review);
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Server error' });
//       }
//     });

//     // Add new review
//     app.post('/addreview', async (req, res) => {
//       const newReview = { ...req.body, createdAt: new Date() };
//       const result = await addreviewCollection.insertOne(newReview);
//       res.send(result);
//     });

//     // Update a review
//     app.put('/addreview/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const updateDoc = { $set: req.body };
//         const result = await addreviewCollection.updateOne({ _id: new ObjectId(id) }, updateDoc);

//         if (result.matchedCount > 0) {
//           res.send({ success: true, message: 'Review updated successfully' });
//         } else {
//           res.send({ success: false, message: 'Review not found' });
//         }
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ success: false, message: 'Server error' });
//       }
//     });

//     // Delete a review
//     app.delete('/addreview/:id', async (req, res) => {
//       const result = await addreviewCollection.deleteOne({ _id: new ObjectId(req.params.id) });
//       res.send({ success: result.deletedCount > 0 });
//     });

//     // ---------------- Favorites ----------------
//     app.get('/favorites', async (req, res) => {
//       const email = req.query.email;
//       const favorites = await favoritesCollection.find({ userEmail: email }).toArray();
//       res.send(favorites);
//     });

//     app.post('/favorites', async (req, res) => {
//       const favorite = req.body;
//       const exists = await favoritesCollection.findOne({ userEmail: favorite.userEmail, foodId: favorite.foodId });
//       if (exists) return res.send({ success: false, message: 'Already in favorites' });
//       const result = await favoritesCollection.insertOne(favorite);
//       res.send({ success: true, result });
//     });

//     app.delete('/favorites/:id', async (req, res) => {
//       const result = await favoritesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
//       res.send({ success: result.deletedCount > 0 });
//     });

//     console.log('Connected to MongoDB successfully!');
//   } finally {
//     // Do not close the client to keep the server running
//     // await client.close();
//   }
// }

// run().catch(console.dir);

// app.listen(port, () => console.log(`Server running on port ${port}`));


import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
const uri = "mongodb+srv://fooddbUser:4Iy3vB7liNQpBJGq@cluster0.vmnz1az.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

let db, productsCollection, addreviewCollection, usersCollection, favoritesCollection;

// Connect once, reuse connection
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("food_db");
    productsCollection = db.collection("products");
    addreviewCollection = db.collection("addreview");
    usersCollection = db.collection("users");
    favoritesCollection = db.collection("favorites");
    console.log("✅ Connected to MongoDB");
  }
}
await connectDB();

// ---------------- Routes ----------------

// Root test
app.get("/", (req, res) => res.send("✅ API is running!"));

// ---------------- Users ----------------
app.post("/users", async (req, res) => {
  const newUser = req.body;
  const existingUser = await usersCollection.findOne({ email: newUser.email });
  if (existingUser) return res.send({ message: "User already exists" });
  const result = await usersCollection.insertOne(newUser);
  res.send(result);
});

// ---------------- Products ----------------
app.get("/products", async (req, res) => {
  const result = await productsCollection.find().toArray();
  res.send(result);
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });
    if (!product) return res.status(404).send({ message: "Product not found" });
    res.send(product);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/products", async (req, res) => {
  const newProduct = req.body;
  const result = await productsCollection.insertOne(newProduct);
  res.send(result);
});

app.patch("/products/:id", async (req, res) => {
  const id = req.params.id;
  const updateProduct = req.body;
  const result = await productsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateProduct }
  );
  res.send(result);
});

app.delete("/products/:id", async (req, res) => {
  const result = await productsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});

// ---------------- Reviews ----------------
app.get("/addreview", async (req, res) => {
  const email = req.query.email;
  const query = email ? { email } : {};
  const result = await addreviewCollection.find(query).sort({ createdAt: -1 }).toArray();
  res.send(result);
});

app.get("/addreview/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const review = await addreviewCollection.findOne({ _id: new ObjectId(id) });
    if (!review) return res.status(404).send({ message: "Review not found" });
    res.send(review);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/addreview", async (req, res) => {
  const newReview = { ...req.body, createdAt: new Date() };
  const result = await addreviewCollection.insertOne(newReview);
  res.send(result);
});

app.put("/addreview/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateDoc = { $set: req.body };
    const result = await addreviewCollection.updateOne({ _id: new ObjectId(id) }, updateDoc);
    if (result.matchedCount > 0) {
      res.send({ success: true, message: "Review updated successfully" });
    } else {
      res.send({ success: false, message: "Review not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

app.delete("/addreview/:id", async (req, res) => {
  const result = await addreviewCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send({ success: result.deletedCount > 0 });
});

// ---------------- Favorites ----------------
app.get("/favorites", async (req, res) => {
  const email = req.query.email;
  const favorites = await favoritesCollection.find({ userEmail: email }).toArray();
  res.send(favorites);
});

app.post("/favorites", async (req, res) => {
  const favorite = req.body;
  const exists = await favoritesCollection.findOne({
    userEmail: favorite.userEmail,
    foodId: favorite.foodId,
  });
  if (exists) return res.send({ success: false, message: "Already in favorites" });
  const result = await favoritesCollection.insertOne(favorite);
  res.send({ success: true, result });
});

app.delete("/favorites/:id", async (req, res) => {
  const result = await favoritesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send({ success: result.deletedCount > 0 });
});

// ✅ Export Express app as Vercel serverless function
export default app;