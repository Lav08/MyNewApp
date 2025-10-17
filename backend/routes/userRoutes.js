const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Adauga un utilizator nou
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login utilizator
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu există!' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Parolă greșită!' });
    }

    res.status(200).json({ message: 'Autentificare reușită', user });
  } catch (error) {
    res.status(500).json({ message: 'Eroare server.' });
  }
});

// Update profil pe baza emailului
router.put('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit.' });
    }

    res.json({ message: 'Profil actualizat!', user: updatedUser });
  } catch (error) {
    console.error('Eroare actualizare:', error);
    res.status(500).json({ message: 'Eroare server la actualizarea profilului.' });
  }
});

// Obtine un utilizator dupa email
router.get('/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase();
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu există' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Eroare la obținerea userului:', error);
    res.status(500).json({ message: 'Eroare server la obținerea userului.' });
  }
});

// Obtine toti utilizatorii
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
