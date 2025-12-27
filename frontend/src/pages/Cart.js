import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { getImageUrl } from "../utils/imageUrl";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getShippingCost,
    getFinalTotal,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="container">
          <h2>Votre panier est vide</h2>
          <p>Découvrez nos produits et ajoutez-les à votre panier</p>
          <Link to="/products" className="btn btn-primary">
            Continuer vos achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Mon Panier</h1>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => {
              const product = item.product || {};

              const basePrice =
                typeof product.prixPromo === "number" &&
                !Number.isNaN(product.prixPromo)
                  ? product.prixPromo
                  : typeof product.prix === "number" &&
                    !Number.isNaN(product.prix)
                  ? product.prix
                  : typeof product.price === "number" &&
                    !Number.isNaN(product.price)
                  ? product.price
                  : 0;

              const discount =
                typeof product.discount === "number" &&
                product.discount > 0 &&
                product.discount < 100
                  ? product.discount
                  : 0;

              const unitPrice =
                discount > 0 ? basePrice * (1 - discount / 100) : basePrice;

              const quantity = item.quantity || 1;

              return (
                <div
                  key={`${product._id}-${item.size}-${item.color}`}
                  className="cart-item"
                >
                  <img
                    src={
                      product.images && product.images[0]
                        ? getImageUrl(product.images[0])
                        : "https://placehold.co/150x150?text=Img"
                    }
                    alt={product.nom}
                  />

                  <div className="item-details">
                    <h3>{product.nom}</h3>
                    <p>Taille: {item.size}</p>
                    <p>Couleur: {item.color}</p>
                  </div>

                  <div className="item-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(
                          product._id,
                          item.size,
                          item.color,
                          Math.max(1, quantity - 1)
                        )
                      }
                    >
                      <FaMinus />
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          product._id,
                          item.size,
                          item.color,
                          quantity + 1
                        )
                      }
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <div className="item-price">
                    <p>{unitPrice.toFixed(2)} DT</p>
                    <p className="item-total">
                      {(unitPrice * quantity).toFixed(2)} DT
                    </p>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(product._id, item.size, item.color)
                    }
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Résumé de la commande</h3>

            <div className="summary-row">
              <span>Sous-total:</span>
              <span>{getCartTotal().toFixed(2)} DT</span>
            </div>

            <div className="summary-row">
              <span>Frais de livraison:</span>
              <span>{getShippingCost().toFixed(2)} DT</span>
            </div>

            <div className="summary-row total">
              <span>Total:</span>
              <span>{getFinalTotal().toFixed(2)} DT</span>
            </div>

            <button
              className="btn btn-primary btn-block"
              onClick={handleCheckout}
            >
              Passer la commande
            </button>

            <Link to="/products" className="continue-shopping">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
