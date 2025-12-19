const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Article = require('../models/Article');

const router = express.Router();

// ============================================
// CONFIGURATION DE MULTER POUR L'UPLOAD
// ============================================

// Créer le dossier uploads/articles s'il n'existe pas
const uploadDir = 'uploads/articles';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'article-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images (JPEG, JPG, PNG, GIF, WEBP) sont autorisées!'));
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB maximum
  fileFilter: fileFilter
});

// ============================================
// ROUTES CRUD
// ============================================

// ✅ CRÉER un article avec image
router.post('/articles', upload.single('image'), async (req, res) => {
  try {
    const { nom, description, prix, categorie, taille, couleur, stock } = req.body;
    
    // Vérifier si l'image a été uploadée
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'L\'image est requise' 
      });
    }
    
    // Chemin relatif de l'image
    const imagePath = `/uploads/articles/${req.file.filename}`;
    
    const article = new Article({
      nom,
      description,
      prix,
      image: imagePath,
      categorie,
      taille,
      couleur,
      stock: stock || 0
    });
    
    await article.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Article créé avec succès',
      article 
    });
  } catch (error) {
    // Supprimer l'image si l'article n'a pas été créé
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('Erreur création article:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création de l\'article',
      error: error.message 
    });
  }
});

// ✅ RÉCUPÉRER tous les articles
router.get('/articles', async (req, res) => {
  try {
    const { categorie, search, limit = 20, page = 1 } = req.query;
    
    let query = {};
    
    // Filtrer par catégorie
    if (categorie) {
      query.categorie = categorie;
    }
    
    // Recherche par nom
    if (search) {
      query.nom = { $regex: search, $options: 'i' };
    }
    
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Article.countDocuments(query);
    
    res.json({ 
      success: true, 
      articles,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Erreur récupération articles:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des articles',
      error: error.message 
    });
  }
});

// ✅ RÉCUPÉRER un article par ID
router.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article non trouvé' 
      });
    }
    
    res.json({ 
      success: true, 
      article 
    });
  } catch (error) {
    console.error('Erreur récupération article:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération de l\'article',
      error: error.message 
    });
  }
});

// ✅ METTRE À JOUR un article
router.put('/articles/:id', upload.single('image'), async (req, res) => {
  try {
    const { nom, description, prix, categorie, taille, couleur, stock } = req.body;
    
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article non trouvé' 
      });
    }
    
    // Mettre à jour les champs
    article.nom = nom || article.nom;
    article.description = description || article.description;
    article.prix = prix || article.prix;
    article.categorie = categorie || article.categorie;
    article.taille = taille || article.taille;
    article.couleur = couleur || article.couleur;
    article.stock = stock !== undefined ? stock : article.stock;
    
    // Si une nouvelle image est uploadée
    if (req.file) {
      // Supprimer l'ancienne image
      const oldImagePath = path.join(__dirname, '..', article.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      
      article.image = `/uploads/articles/${req.file.filename}`;
    }
    
    await article.save();
    
    res.json({ 
      success: true, 
      message: 'Article mis à jour avec succès',
      article 
    });
  } catch (error) {
    console.error('Erreur mise à jour article:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la mise à jour de l\'article',
      error: error.message 
    });
  }
});

// ✅ SUPPRIMER un article
router.delete('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article non trouvé' 
      });
    }
    
    // Supprimer l'image du serveur
    const imagePath = path.join(__dirname, '..', article.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    await article.deleteOne();
    
    res.json({ 
      success: true, 
      message: 'Article supprimé avec succès' 
    });
  } catch (error) {
    console.error('Erreur suppression article:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la suppression de l\'article',
      error: error.message 
    });
  }
});

module.exports = router;