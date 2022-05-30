const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ecalzoq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("cycle-parts").collection("parts")
    const userCollection = client.db("cycle-parts").collection("users")
    const reviewCollection = client.db("cycle-parts").collection("review")
    const orderCollection = client.db("cycle-parts").collection("order")

    // console.log('database connected');
    app.get('/parts', async (req, res) => {
      const query = {}
      const cursor = productCollection.find(query)
      const product = await cursor.toArray()
      res.send(product)
    })

    //try
    app.get('/users', async (req, res) => {
      const query = {}
      const cursor = userCollection.find(query)
      const user = await cursor.toArray()
      res.send(user)

    })

    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const orders = await orderCollection.findOne(query);
      res.send(orders)
    })
    app.get("/orders/user/:email", async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const users = await orderCollection.find(query).toArray();
      res.send(users);
    });

    // review
    app.post("/review", async (req, res) => {
      const order = req.body;
      const result = await reviewCollection.insertOne(order);
      res.send(result);
    });

    app.get("/review", async (req, res) => {
      const review = await reviewCollection.find().toArray();
      res.send(review);
    });
    //try

//info
    app.get("/info/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email)
      const info = await profileCollection.findOne({ email: email });
      res.send(info);
    });
  }
  finally {

  }

}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from Cycle-parts-server!')
});

//



app.listen(port, () => {
  console.log(`Cycle-parts app listening on port ${port}`)
})