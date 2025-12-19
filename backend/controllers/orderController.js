const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc    Créer une nouvelle commande
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, notes } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Aucun article dans la commande" });
    }

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city
    ) {
      return res
        .status(400)
        .json({ message: "Adresse de livraison incomplète" });
    }

    // Vérifier la disponibilité des produits et calculer le total
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Produit non trouvé: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuffisant pour ${product.nom}. Disponible: ${product.stock}`,
        });
      }

      // Calcul du prix en utilisant le schéma français (prix / prixPromo)
      const basePrice =
        typeof product.prixPromo === "number" &&
        !Number.isNaN(product.prixPromo)
          ? product.prixPromo
          : typeof product.prix === "number" && !Number.isNaN(product.prix)
          ? product.prix
          : 0;

      const itemPrice = basePrice;

      subtotal += itemPrice * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.nom,
        price: itemPrice,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image:
          product.images && product.images.length > 0 ? product.images[0] : "",
      });

      // Réduire le stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculer les frais de livraison (exemple: gratuit au-dessus de 100 DT)
    const shippingCost = subtotal >= 100 ? 0 : 7.0;
    const totalAmount = subtotal + shippingCost;

    // Créer la commande
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingCost,
      totalAmount,
      notes,
      paymentMethod: "cash_on_delivery",
    });

    // Peupler les informations du produit
    await order.populate("items.product", "nom images");

    res.status(201).json(order);
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la création de la commande",
        error: error.message,
      });
  }
};

// @desc    Obtenir toutes les commandes de l'utilisateur connecté
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Obtenir une commande par ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product", "name images");

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    // Vérifier que l'utilisateur a le droit de voir cette commande
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    res.json(order);
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Obtenir toutes les commandes (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .populate("items.product", "name images")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Mettre à jour le statut d'une commande (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;

    const validStatuses = [
      "en_attente",
      "confirmee",
      "en_preparation",
      "expediee",
      "livree",
      "annulee",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    order.status = status;

    if (comment) {
      order.statusHistory[order.statusHistory.length - 1].comment = comment;
    }

    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Annuler une commande
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    // Vérifier que l'utilisateur est propriétaire de la commande
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Vérifier que la commande peut être annulée
    if (["expediee", "livree"].includes(order.status)) {
      return res.status(400).json({
        message:
          "Cette commande ne peut plus être annulée. Contactez le service client.",
      });
    }

    // Restaurer le stock des produits
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = "annulee";
    await order.save();

    res.json({ message: "Commande annulée avec succès", order });
  } catch (error) {
    console.error("Erreur lors de l'annulation de la commande:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
