const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  rateProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/auth");

router
  .route("/")
  .get(getProducts)
  .post(protect, admin, upload.single("image"), createProduct);

router.get("/featured", getFeaturedProducts);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct);

router.post("/:id/rate", protect, rateProduct);

module.exports = router;
