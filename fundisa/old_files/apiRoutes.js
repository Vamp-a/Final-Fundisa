const express = require('express');
const connectToDatabase = require('../config/database');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Add your CRUD endpoints for each collection here
router.get('/schools', async (req, res) => {
  const { db } = await connectToDatabase();
  const schools = await db.collection('schools').find().toArray();
  res.json(schools);
});

// Add other collection endpoints similarly

module.exports = router;