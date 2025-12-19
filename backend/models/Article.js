const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix doit être positif']
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise']
  },
  categorie: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: ['Homme', 'Femme', 'Enfant', 'Accessoires']
  },
  taille: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '']
  },
  couleur: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Le stock ne peut pas être négatif']
  },
  enVedette: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Index pour améliorer les performances de recherche
articleSchema.index({ nom: 1, categorie: 1 });

module.exports = mongoose.model('Article', articleSchema);