const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ IMPORTANT : Servir les fichiers statiques (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// ROUTES
// ============================================
const articleRoutes = require('./routes/articles');
app.use('/api', articleRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: '✅ API E-commerce vêtements' });
});

// ============================================
// CONNEXION MONGODB
// ============================================
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_vetements';

mongoose.connect(MONGO_URI)
.then(() => {
  console.log('✅ MongoDB connecté avec succès');
  
  // Vérification de la connexion
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'déconnecté',
    1: 'connecté',
    2: 'connexion en cours',
    3: 'déconnexion en cours'
  };
  console.log(`📊 État de la connexion MongoDB: ${states[dbState]}`);
  
  // Affiche la base de données connectée
  console.log(`🗄️ Base de données: ${mongoose.connection.name}`);
})
.catch(err => {
  console.error('❌ Erreur de connexion MongoDB:', err.message);
  
  // Suggestions de dépannage
  if (err.message.includes('ECONNREFUSED')) {
    console.error('💡 Assurez-vous que MongoDB est démarré localement:');
    console.error('   - Windows: "net start MongoDB" ou démarrez via Services');
    console.error('   - macOS/Linux: "sudo systemctl start mongod"');
    console.error('   - Ou exécutez "mongod" dans un terminal séparé');
  }
  
  if (err.message.includes('ENOTFOUND')) {
    console.error('💡 Vérifiez que l\'URI MongoDB est correcte:', MONGO_URI);
  }
});

// ============================================
// ÉVÉNEMENTS DE CONNEXION MONGODB
// ============================================
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connecté à MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur de connexion Mongoose:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose déconnecté de MongoDB');
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  console.log(`📂 Les images sont accessibles via : http://localhost:${PORT}/uploads/articles/`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'non défini'}`);
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Une erreur est survenue sur le serveur',
    error: err.message 
  });
});

module.exports = app;