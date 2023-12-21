const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5022;
require('dotenv').config()


// middlewares
app.use(express.json());
app.use(cors());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frg7rqf.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();





    const taskCollection = client.db("taskmanagement").collection("taskCollection");
    const userCollection = client.db("taskmanagement").collection("userCollection");




    app.post('/task',async(req,res)=>{
        const data = req.body;
        const query = {email: data.email}
        const isExist = await taskCollection.findOne(query);
        if(isExist){
            return res.send({message: "AH"})
        }else{
            const result = await taskCollection.insertOne(data);
            res.send(result);
        }
    })



    // create user
    app.post('/user',async(req,res)=>{
      const data = req.body;
      const result = await userCollection.insertOne(data);
      res.send(result);
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/',(req,res)=>{
    res.send("Server is running ~")
});

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})