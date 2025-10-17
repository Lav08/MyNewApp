const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  password: String,
  birthdate: String,
  age: String,
  location: String,
  occupation: String,
  bio: String,
  profileImage: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
