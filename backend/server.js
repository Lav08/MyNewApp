const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

//  Conectare MongoDB
mongoose.connect(
  'mongodb+srv://laviniamuntean03:Parola%40123@cluster0.touijtm.mongodb.net/myapp?retryWrites=true&w=majority',
)
.then(() => console.log('✅ Conectat la MongoDB'))
.catch(err => console.error('❌ Eroare MongoDB:', err));

//  Elimină complet schema și modelul User de aici!
// Logica de salvare este în userRoutes.js

app.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Serverul rulează pe http://0.0.0.0:3000');
});

