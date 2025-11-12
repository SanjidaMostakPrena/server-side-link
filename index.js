const express = require('express')
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://fooddbUser:4Iy3vB7liNQpBJGq@cluster0.vmnz1az.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

async function run() {
  try {
    await client.connect();

    const db = client.db('food_db')
    const productsCollection = db.collection('products');
    const addreviewCollection = db.collection('addreview');

    const usersCollection = db.collection('users');
    const favoritesCollection = db.collection('favorites');

    // user post
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email }
      const exitstingUser = await usersCollection.findOne(query);
      if (exitstingUser) {
        res.send({ message: 'user already exits.do not need to insert again' })
      }
      else {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }



    })




    // all data show
    app.get('/products', async (req, res) => {
      // const cursor = productsCollection.find().sort({rating:1}).limit(5);
      // email diye json run
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // all card show
    app.get('/latestproducts', async (req, res) => {
      // const cursor = productsCollection.find().sort({rating:1}).limit(5);
      // email diye json run
      const cursor = productsCollection.find().limit(8);
      const result = await cursor.toArray();
      res.send(result);
    })



    // // addreview related api
    app.get('/addreview', async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) query.email = email;

      const cursor = addreviewCollection.find(query).sort({ createdAt: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/addreview', async (req, res) => {
      const { foodName, foodImage, restaurantName, location, rating, reviewText, email } = req.body;

      if (!foodName || !restaurantName || !reviewText || !email) {
        return res.status(400).send({ message: 'Please provide all required fields' });
      }

      const newaddreview = {
        foodName,
        foodImage,
        restaurantName,
        location,
        rating,
        reviewText,
        email,
        createdAt: new Date()
      };

      const result = await addreviewCollection.insertOne(newaddreview);
      res.send(result);
    });


    // delete addreview part .....

    app.delete("/addreview/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await addreviewCollection.deleteOne(query);

        if (result.deletedCount > 0) {
          res.send({ success: true, message: "Review deleted successfully" });
        } else {
          res.status(404).send({ success: false, message: "Review not found" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, message: "Server error" });
      }
    });



    // update button
    const { ObjectId } = require("mongodb");

    app.put("/addreview/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const { foodName, foodImage, restaurantName, location, rating, reviewText } = req.body;

        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { foodName, foodImage, restaurantName, location, rating, reviewText }
        };

        const result = await addreviewCollection.updateOne(filter, updateDoc);

        if (result.modifiedCount > 0) {
          res.send({ success: true, message: "Review updated successfully" });
        } else {
          res.status(404).send({ success: false, message: "Review not found" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, message: "Server error" });
      }
    });



    // Get all favorites for a user
    app.get("/favorites", async (req, res) => {
      const email = req.query.email;
      const favorites = await favoritesCollection.find({ userEmail: email }).toArray();
      res.send(favorites);
    });

    // Add new favorite
    app.post("/favorites", async (req, res) => {
      const favorite = req.body;
      const exists = await favoritesCollection.findOne({
        userEmail: favorite.userEmail,
        foodId: favorite.foodId,
      });

      if (exists) {
        return res.send({ success: false, message: "Already in favorites" });
      }

      const result = await favoritesCollection.insertOne(favorite);
      res.send({ success: true, result });
    });

    app.delete("/favorites/:id", async (req, res) => {
      const result = await favoritesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      if (result.deletedCount > 0) {
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    });

    // Express example
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = await Product.findById(id);
      if (!product) return res.status(404).send({ message: "Product not found" });
      res.send(product);
    });


    // Delete favorite
    app.delete("/favorites/:id", async (req, res) => {
      const result = await Favorite.deleteOne({ _id: req.params.id });
      res.send({ success: result.deletedCount > 0 });
    });


    // specific data show id search
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.findOne(query);
      res.send(result);
    })
    // data create
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    })

    // update
    app.patch('/products/:id', async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const query = { _id: new ObjectId(id) }
      const update = {
        $set: {
          name: updateProduct.name,
          price: updateProduct.price
        }
      }
      const result = await productsCollection.updateOne(query, update)
      res.send(result)

    })

    // delete
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    })

    // addreview related

    app.get('/products/addreview', async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }

      const cursor = addreviewCollection.find(query).sort({ createdAt: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });


    // add json extra

    app.post('/addreview', async (req, res) => {
      const newaddreview = req.body;
      const result = await addreviewCollection.insertOne(newaddreview);
      res.send(result);

    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {


  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




