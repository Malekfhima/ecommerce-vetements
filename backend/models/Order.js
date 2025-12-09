const mongoose = require("mongoose");

// Schéma de commande aligné avec le contrôleur orderController.js
// et avec le frontend (items, shippingAddress, subtotal, shippingCost, totalAmount, status...)

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    size: String,
    color: String,
    image: String,
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    additionalInfo: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        "Une commande doit contenir au moins un article",
      ],
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      required: true,
      min: 0,
      default: 7,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "en_attente",
        "confirmee",
        "en_preparation",
        "expediee",
        "livree",
        "annulee",
      ],
      default: "en_attente",
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "card", "bank_transfer"],
      default: "cash_on_delivery",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    deliveredAt: Date,
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "en_attente",
            "confirmee",
            "en_preparation",
            "expediee",
            "livree",
            "annulee",
          ],
        },
        date: {
          type: Date,
          default: Date.now,
        },
        comment: String,
      },
    ],
    orderNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
