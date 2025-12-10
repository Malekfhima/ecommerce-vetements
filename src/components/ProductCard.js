import React from "react";
import { Link } from "react-router-dom";
import { FiStar, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { getImageUrl } from "../utils/imageUrl";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Ajouter avec la première taille et couleur disponibles
    const sizes = product.sizes || product.tailles || [];
    const colors = product.colors || product.couleurs || [];
    const defaultSize = sizes.length > 0 ? sizes[0] : "";
    const defaultColor = colors.length > 0 ? colors[0] : "";

    addToCart(product, 1, defaultSize, defaultColor);
  };

  // Gérer à la fois les champs anglais (price, discount) et français (prix, prixPromo)
  const basePriceRaw =
    product.price ??
    (typeof product.prix === "number" ? product.prix : undefined);

  // Si prixPromo est présent et inférieur au prix, on l'utilise comme prix final
  const promoPriceRaw =
    typeof product.prixPromo === "number" ? product.prixPromo : undefined;

  let finalPriceRaw;
  if (
    promoPriceRaw != null &&
    basePriceRaw != null &&
    promoPriceRaw < basePriceRaw
  ) {
    finalPriceRaw = promoPriceRaw;
  } else if (typeof product.discount === "number" && basePriceRaw != null) {
    finalPriceRaw = basePriceRaw * (1 - product.discount / 100);
  } else {
    finalPriceRaw = basePriceRaw;
  }

  const finalPrice = typeof finalPriceRaw === "number" ? finalPriceRaw : 0;
  const originalPrice =
    typeof basePriceRaw === "number" ? basePriceRaw : finalPrice;

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image-wrapper">
        <img
          src={getImageUrl(product.images && product.images[0])}
          alt={product.name || product.nom}
          className="product-image"
        />
        {typeof product.discount === "number" && product.discount > 0 && (
          <span className="product-badge">-{product.discount}%</span>
        )}
      </div>

      <div className="product-info">
        <div className="product-category">
          {product.category || product.categorie}
        </div>

        <h3 className="product-name">{product.name || product.nom}</h3>

        {(product.rating || product.note) > 0 && (
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  fill={
                    i < Math.floor(product.rating || product.note || 0)
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>
            <span>({product.numReviews || product.nombreAvis || 0})</span>
          </div>
        )}

        <div className="product-price-wrapper">
          <span className="product-price">{finalPrice.toFixed(2)} DT</span>
          {originalPrice > finalPrice && (
            <span className="product-old-price">
              {originalPrice.toFixed(2)} DT
            </span>
          )}
        </div>

        <button
          onClick={handleQuickAdd}
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "0.5rem" }}
        >
          <FiShoppingCart /> Ajouter au panier
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
