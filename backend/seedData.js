const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Product = require("./models/Product");
const User = require("./models/User");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connecté");
  } catch (error) {
    console.error("Erreur de connexion:", error);
    process.exit(1);
  }
};

const products = [
  {
    nom: "T-shirt Homme Blanc",
    description:
      "T-shirt 100% coton, confortable et respirant. Parfait pour un style décontracté.",
    prix: 29.99,
    categorie: "homme",
    sousCategorie: "t-shirt",
    tailles: ["S", "M", "L", "XL"],
    couleurs: ["Blanc", "Noir", "Gris"],
    stock: 50,
    images: [],
    marque: "BasicWear",
    enVedette: true,
    note: 4.5,
    nombreAvis: 23,
  },
  {
    nom: "Jean Slim Homme",
    description: "Jean slim stretch, coupe moderne et confortable.",
    prix: 79.99,
    prixPromo: 59.99,
    categorie: "homme",
    sousCategorie: "pantalon",
    tailles: ["30", "32", "34", "36", "38"],
    couleurs: ["Bleu", "Noir"],
    stock: 30,
    images: [],
    marque: "DenimCo",
    enVedette: true,
    note: 4.8,
    nombreAvis: 45,
  },
  {
    nom: "Robe Été Femme",
    description:
      "Robe légère et élégante, idéale pour les journées ensoleillées.",
    prix: 89.99,
    categorie: "femme",
    sousCategorie: "robe",
    tailles: ["XS", "S", "M", "L"],
    couleurs: ["Rouge", "Bleu", "Jaune"],
    stock: 25,
    images: [],
    marque: "SummerStyle",
    enVedette: true,
    note: 4.7,
    nombreAvis: 38,
  },
  {
    nom: "Veste Jean Femme",
    description: "Veste en jean classique, intemporelle et polyvalente.",
    prix: 99.99,
    prixPromo: 79.99,
    categorie: "femme",
    sousCategorie: "veste",
    tailles: ["S", "M", "L", "XL"],
    couleurs: ["Bleu clair", "Noir"],
    stock: 20,
    images: [],
    marque: "DenimCo",
    enVedette: true,
    note: 4.6,
    nombreAvis: 31,
  },
  {
    nom: "Pantalon Enfant",
    description:
      "Pantalon confortable pour enfants, résistant et facile d'entretien.",
    prix: 39.99,
    categorie: "enfant",
    sousCategorie: "pantalon",
    tailles: ["4ans", "6ans", "8ans", "10ans", "12ans"],
    couleurs: ["Bleu", "Noir", "Beige"],
    stock: 40,
    images: [],
    marque: "KidsWear",
    enVedette: false,
    note: 4.4,
    nombreAvis: 19,
  },
  {
    nom: "Chemise Homme Blanche",
    description: "Chemise élégante pour occasions formelles.",
    prix: 49.99,
    categorie: "homme",
    sousCategorie: "t-shirt",
    tailles: ["S", "M", "L", "XL", "XXL"],
    couleurs: ["Blanc", "Bleu clair"],
    stock: 35,
    images: [],
    marque: "FormalWear",
    enVedette: false,
    note: 4.3,
    nombreAvis: 27,
  },
  {
    nom: "Jupe Plissée Femme",
    description:
      "Jupe plissée élégante, parfaite pour le bureau ou les sorties.",
    prix: 59.99,
    categorie: "femme",
    sousCategorie: "jupe",
    tailles: ["XS", "S", "M", "L"],
    couleurs: ["Noir", "Bordeaux", "Marine"],
    stock: 28,
    images: [],
    marque: "ChicStyle",
    enVedette: true,
    note: 4.5,
    nombreAvis: 22,
  },
  {
    nom: "Baskets Sport Homme",
    description: "Baskets confortables pour le sport et le quotidien.",
    prix: 89.99,
    prixPromo: 69.99,
    categorie: "homme",
    sousCategorie: "chaussures",
    tailles: ["40", "41", "42", "43", "44"],
    couleurs: ["Blanc", "Noir", "Gris"],
    stock: 45,
    images: [],
    marque: "SportPro",
    enVedette: true,
    note: 4.9,
    nombreAvis: 67,
  },
  {
    nom: "Sac à Main Femme",
    description: "Sac élégant en cuir synthétique, spacieux et pratique.",
    prix: 69.99,
    categorie: "accessoires",
    sousCategorie: "sac",
    tailles: ["Unique"],
    couleurs: ["Noir", "Marron", "Beige"],
    stock: 22,
    images: [],
    marque: "LuxeBags",
    enVedette: false,
    note: 4.6,
    nombreAvis: 34,
  },
  {
    nom: "Sweat à Capuche Unisexe",
    description:
      "Sweat confortable avec capuche, idéal pour les journées fraîches.",
    prix: 49.99,
    categorie: "homme",
    sousCategorie: "t-shirt",
    tailles: ["S", "M", "L", "XL", "XXL"],
    couleurs: ["Noir", "Gris", "Marine", "Bordeaux"],
    stock: 60,
    images: [],
    marque: "ComfortWear",
    enVedette: true,
    note: 4.7,
    nombreAvis: 52,
  },
];

const users = [
  {
    nom: "Admin",
    prenom: "Super",
    email: "admin@vetements.com",
    password: "admin123",
    role: "admin",
    telephone: "21612345678",
  },
  {
    nom: "Client",
    prenom: "Test",
    email: "client@test.com",
    password: "client123",
    role: "client",
    telephone: "21698765432",
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Supprimer les données existantes
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Données existantes supprimées");

    // Ajouter les nouveaux produits
    await Product.insertMany(products);
    console.log("Produits ajoutés");

    // Hasher les mots de passe puis ajouter les utilisateurs
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    );

    await User.insertMany(usersWithHashedPasswords);

    console.log("Utilisateurs ajoutés");

    console.log("\n✅ Base de données initialisée avec succès!");
    console.log("\nComptes de test:");
    console.log("Admin: admin@vetements.com / admin123");
    console.log("Client: client@test.com / client123");

    process.exit();
  } catch (error) {
    console.error("Erreur:", error);
    process.exit(1);
  }
};

seedData();
