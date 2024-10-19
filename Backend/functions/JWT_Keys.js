require('dotenv').config();
const JWT_KEY = process.env.JWT_KEY;
const jwt = require('jsonwebtoken');

function Create_Key(payload) {
  return jwt.sign(payload, JWT_KEY, { expiresIn: '20h' })
}

function Verify_Key(token) {
  try {
    const decoded = jwt.verify(token, JWT_KEY);
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

module.exports = { Create_Key, Verify_Key }