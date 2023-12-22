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
    // await client.connect();

    const taskCollection = client.db("taskmanagement").collection("taskCollection");
    const userCollection = client.db("taskmanagement").collection("userCollection");


    // create new task 
    app.post('/task', async (req, res) => {
      const data = req.body;
      const result = await taskCollection.insertOne(data);
      res.send(result);
    })

    // get all task
    app.get('/task', async (req, res) => {
      const query = { email: req.query.email };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    })

    // update task 
    app.patch('/task', async (req, res) => {
      const data = req.body;
      const query = { _id: new ObjectId(data.id) };
      const updatedDoc = {
        $set: {
          status: data.status
        }
      }
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result);
    })

    // delete task
    app.delete('/task/:sid', async (req, res) => {
      const id = req.params.sid;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    })

    // edit task
    app.put('/task/:sid', async (req, res) => {
      const id = req.params.sid;
      const data = req.body;
      const filter = { _id: new ObjectId(id) }
      const updatedDoc = {
        $set: {
          title: data.title,
          deadline: data.deadline,
          description: data.description,
          priority: data.priority
        }
      }
      const result = await taskCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })



    // create user
    app.post('/user', async (req, res) => {
      const data = req.body;
      const query = { email: data.email };
      const isExist = await userCollection.findOne(query);
      if (!isExist) {
        const result = await userCollection.insertOne(data);
        res.send(result);
      }
    })


    // get peoples rev
    app.get('/stat',async(req,res)=>{
      const allData = await userCollection.find({}).toArray();
      console.log(allData);
      const webDev = allData.filter(one=>one.profession == 'web developer');
      const student = allData.filter(one=>one.profession =='student');
      const teacher = allData.filter(one=>one.profession == 'teacher'); 
      res.send({webDev,student,teacher})
    })






    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send("Server is running ~")
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})