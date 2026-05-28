// api/produits.js
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Ouzaif:WwmcCM6p5XaLYVx0@cluster0.4amt8zx.mongodb.net/?appName=Cluster0";

export default async function handler(req, res) {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('MAMshopDB');
  
  if (req.method === 'POST') {
    const result = await db.collection('Produits').insertOne(req.body);
    res.status(200).json(result);
  } else {
    const produits = await db.collection('Produits').find({}).toArray();
    res.status(200).json(produits);
  }
}
