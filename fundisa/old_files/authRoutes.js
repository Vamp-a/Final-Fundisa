const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../config/database');

const router = express.Router();

router.post('/login', async (req, res) => {
  // Your login endpoint code
});

router.post('/signup', async (req, res) => {
  // Your signup endpoint code
});

module.exports = router;