const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
const PORT = 5005;

app.use(bodyParser.json());

// MongoDB connection string
const mongoURI = 'mongodb+srv://guptavarun25122003:varun2003@cluster0.wtt7bqb.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/addMaliciousDomain', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('Sih');
      const collection = database.collection('malicious_domains');
  
      const domainData = req.body;
      console.log(domainData);
  
      // Use a case-insensitive regex for domain comparison
      const existingDomain = await collection.findOne({ '#domain': { $regex: new RegExp(domainData['#domain'], 'i') } });
  
      if (!existingDomain) {
        // If the domain is not present, add it to the database
        await collection.insertOne(domainData);
        res.status(201).send('Malicious domain added to the database.');
      } else {
        // If the domain is already present, send a conflict response
        res.status(409).send('Malicious domain already exists in the database.');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } finally {
      await client.close();
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
