const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors'); // นำเข้าแพ็กเกจ cors

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // ใช้ middleware cors

const uri = "mongodb+srv://66010395:200412@test.8gpmp.mongodb.net/?retryWrites=true&w=majority&appName=test";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('mbproject');
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

// API routes
app.post('/save', async (req, res) => {
  const { key, value } = req.body;
  try {
    const collection = db.collection('data');
    await collection.updateOne({ key }, { $set: { value } }, { upsert: true });
    res.send('Data saved to MongoDB');
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    res.status(500).send('Error saving data to MongoDB');
  }
});

app.get('/load/:key', async (req, res) => {
  const { key } = req.params;
  try {
    const collection = db.collection('data');
    const data = await collection.findOne({ key });
    if (data) {
      res.json(data.value);
    } else {
      res.status(404).send('No such document!');
    }
  } catch (error) {
    console.error('Error loading data from MongoDB:', error);
    res.status(500).send('Error loading data from MongoDB');
  }
});

app.listen(port, '0.0.0.0', () => { // ฟังที่ทุก IP Address
  console.log(`Server running at http://0.0.0.0:${port}`);
});