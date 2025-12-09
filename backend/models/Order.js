const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  produits: [{
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    nom: String,
    quantite: {
      type: Number,
      required: true,
      min: 1
    },
    taille: String,
    couleur: String,
    prix: {
      type: Number,
      required: true
    }
  }],
  adresseLivraison: {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    rue: { type: String, required: true },
    ville: { type: String, required: true },
    codePostal: { type: String, required: true },
    pays: { type: String, default: 'Tunisie' },
    telephone: { type: String, required: true }
  },
  montantTotal: {
    type: Number,
    required: true,
    min: 0
  },
  fraisLivraison: {
    type: Number,
    default: 7,
    min: 0
  },
  statut: {
    type: String,
    enum: ['en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee'],
    default: 'en_attente'
  },
  methodePaiement: {
    type: String,
    enum: ['especes', 'carte', 'virement'],
    default: 'especes'
  },
  estPayee: {
    type: Boolean,
    default: false
  },
  datePaiement: Date,
  dateLivraison: Date
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);