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


// all data show
app.get('/products', async(req, res) =>{
    const cursor = productsCollection.find();
const result = await cursor.toArray();
res.send(result);
})
// specific data show id search
app.get('/products/:id', async(req, res) =>{
    const id = req.params.id;
      const query = {_id:new ObjectId(id)}
const result = await productsCollection.findOne(query);
res.send(result);
})
    // data ....
app.post('/products',async(req,res) =>{
  const newProduct = req.body;
  const result = await productsCollection.insertOne(newProduct);
  res.send(result);
})

// update
app.patch('/products/:id', async(req,res)=>{
    const id = req.params.id;
    const updateProduct = req.body;
     const query = {_id:new ObjectId(id)}
     const update = {
        $set:{
            name:updateProduct.name,
            price:updateProduct.price
        }
     }
const result = await productsCollection.updateOne(query,update)
res.send(result)

    })

// delete
app.delete('/products/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id:new ObjectId(id)}
    const result = await productsCollection.deleteOne(query);
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
