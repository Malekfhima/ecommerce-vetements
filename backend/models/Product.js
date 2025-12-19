const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom du produit est requis"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La description est requise"],
    },
    prix: {
      type: Number,
      required: [true, "Le prix est requis"],
      min: 0,
    },
    prixPromo: {
      type: Number,
      min: 0,
    },
    categorie: {
      type: String,
      required: true,
      enum: ["homme", "femme", "enfant", "accessoires"],
    },
    sousCategorie: {
      type: String,
      required: true,
      enum: [
        "t-shirt",
        "pantalon",
        "robe",
        "jupe",
        "veste",
        "chaussures",
        "sac",
        "autre",
      ],
    },
    tailles: [
      {
        type: String,
        enum: [
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "XXL",
          "30",
          "32",
          "34",
          "36",
          "38",
          "36",
          "37",
          "38",
          "39",
          "40",
          "41",
          "42",
          "43",
          "44",
          "4ans",
          "6ans",
          "8ans",
          "10ans",
          "12ans",
          "Unique",
        ],
      },
    ],
    couleurs: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    marque: {
      type: String,
      trim: true,
    },
    enVedette: {
      type: Boolean,
      default: false,
    },
    note: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    nombreAvis: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
