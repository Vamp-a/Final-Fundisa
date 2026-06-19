// controllers/usersController.js
const { connectToDatabase } = require('./connection');

async function getUsers() {
  const client = await connectToDatabase();
  const db = client.db('fundisa-cluster');
  return await db.collection('users').find({}).toArray();
}

async function createUser(userData) {
  const client = await connectToDatabase();
  const db = client.db('fundisa-cluster');
  return await db.collection('users').insertOne(userData);
}

module.exports = {
  getUsers,
  createUser
};