const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const firestore = require("./firebase");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB URI
const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vmnz1az.mongodb.net/?retryWrites=true&w=majority`
);

async function run() {
  try {
    await client.connect();
    const db = client.db("food_db");

    const productsCollection = db.collection("products");
    const addreviewCollection = db.collection("addreview");
    const usersCollection = db.collection("users");
    const favoritesCollection = db.collection("favorites");

    // ----- Routes -----

    app.get("/", (req, res) => res.send("Hello World!"));

    // Users
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const existingUser = await usersCollection.findOne({ email: newUser.email });
      if (existingUser) return res.send({ message: "User already exists" });
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // Products
    app.get("/products", async (req, res) => {
      const products = await productsCollection.find().toArray();
      res.json(products);
    });

    app.get("/products/:id", async (req, res) => {
      try {
        const product = await productsCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.post("/products", async (req, res) => {
      const result = await productsCollection.insertOne(req.body);
      res.json(result);
    });

    app.patch("/products/:id", async (req, res) => {
      const result = await productsCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
      res.json(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const result = await productsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json(result);
    });

    // Reviews
    app.get("/addreview", async (req, res) => {
      const email = req.query.email;
      const query = email ? { email } : {};
      const reviews = await addreviewCollection.find(query).sort({ createdAt: -1 }).toArray();
      res.json(reviews);
    });

    app.get("/addreview/:id", async (req, res) => {
      try {
        const review = await addreviewCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!review) return res.status(404).json({ message: "Review not found" });
        res.json(review);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.post("/addreview", async (req, res) => {
      const review = { ...req.body, createdAt: new Date() };
      const result = await addreviewCollection.insertOne(review);
      res.json(result);
    });

    app.put("/addreview/:id", async (req, res) => {
      try {
        const result = await addreviewCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: req.body }
        );
        if (result.matchedCount > 0) {
          res.json({ success: true, message: "Review updated successfully" });
        } else {
          res.json({ success: false, message: "Review not found" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
      }
    });

    app.delete("/addreview/:id", async (req, res) => {
      const result = await addreviewCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ success: result.deletedCount > 0 });
    });

    // Favorites
    app.get("/favorites", async (req, res) => {
      const email = req.query.email;
      const favorites = await favoritesCollection.find({ userEmail: email }).toArray();
      res.json(favorites);
    });

    app.post("/favorites", async (req, res) => {
      const favorite = req.body;
      const exists = await favoritesCollection.findOne({
        userEmail: favorite.userEmail,
        foodId: favorite.foodId,
      });
      if (exists) return res.json({ success: false, message: "Already in favorites" });
      const result = await favoritesCollection.insertOne(favorite);
      res.json({ success: true, result });
    });

    app.delete("/favorites/:id", async (req, res) => {
      const result = await favoritesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ success: result.deletedCount > 0 });
    });

    console.log("Connected to MongoDB successfully!");
  } finally {
    // keep client alive
  }
}

run().catch(console.error);

app.listen(port, () => console.log(`Server running on port ${port}`));
