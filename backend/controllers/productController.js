const Product = require("../models/Product");

// @desc    Obtenir tous les produits
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { categorie, sousCategorie, minPrix, maxPrix, search } = req.query;

    let query = {};

    if (categorie) query.categorie = categorie;
    if (sousCategorie) query.sousCategorie = sousCategorie;
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (minPrix || maxPrix) {
      query.prix = {};
      if (minPrix) query.prix.$gte = Number(minPrix);
      if (maxPrix) query.prix.$lte = Number(maxPrix);
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir un produit
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Produit non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer un produit (Admin)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const body = { ...req.body };

    // Helper pour convertir les nombres (gère les virgules françaises)
    const toNumberOrUndefined = (value) => {
      if (value === undefined || value === null || value === "")
        return undefined;
      const normalized = String(value).replace(",", ".");
      const num = Number(normalized);
      return Number.isNaN(num) ? undefined : num;
    };

    // Convertir certains champs en nombres (en acceptant 49,99)
    const prix = toNumberOrUndefined(body.prix);
    if (prix !== undefined) body.prix = prix;

    const prixPromo = toNumberOrUndefined(body.prixPromo);
    if (prixPromo !== undefined) body.prixPromo = prixPromo;

    const stock = toNumberOrUndefined(body.stock);
    if (stock !== undefined) body.stock = stock;

    // Si une image est uploadée, l'ajouter au tableau images
    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      body.images = [imagePath];
    }

    const product = await Product.create(body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour un produit (Admin)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    const toNumberOrUndefined = (value) => {
      if (value === undefined || value === null || value === "")
        return undefined;
      const normalized = String(value).replace(",", ".");
      const num = Number(normalized);
      return Number.isNaN(num) ? undefined : num;
    };

    const prix = toNumberOrUndefined(updates.prix);
    if (prix !== undefined) updates.prix = prix;

    const prixPromo = toNumberOrUndefined(updates.prixPromo);
    if (prixPromo !== undefined) updates.prixPromo = prixPromo;

    const stock = toNumberOrUndefined(updates.stock);
    if (stock !== undefined) updates.stock = stock;

    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      updates.images = [imagePath];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Produit non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer un produit (Admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (product) {
      res.json({ message: "Produit supprimé" });
    } else {
      res.status(404).json({ message: "Produit non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir produits en vedette
// @route   GET /api/products/featured
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ enVedette: true }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Noter un produit
// @route   POST /api/products/:id/rate
// @access  Privé (utilisateur connecté)
exports.rateProduct = async (req, res) => {
  try {
    const { note } = req.body;

    if (typeof note !== "number" || note < 0 || note > 5) {
      return res
        .status(400)
        .json({ message: "La note doit être un nombre entre 0 et 5" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    const totalNote = product.note * product.nombreAvis + note;
    const nouveauNombreAvis = product.nombreAvis + 1;
    product.nombreAvis = nouveauNombreAvis;
    product.note = totalNote / nouveauNombreAvis;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
