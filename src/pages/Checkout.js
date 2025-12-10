import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { FiCreditCard } from "react-icons/fi";
import { getImageUrl } from "../utils/imageUrl";

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, getCartTotal, getShippingCost, getFinalTotal, clearCart } =
    useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    additionalInfo: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
      return;
    }

    if (cartItems.length === 0) {
      navigate("/cart");
      return;
    }

    // Pré-remplir avec les infos utilisateur
    if (user) {
      setShippingAddress({
        name: user.name || "",
        phone: user.phone || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        postalCode: user.address?.postalCode || "",
        additionalInfo: "",
      });
    }
  }, [user, isAuthenticated, cartItems, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const orderData = {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress,
      };

      const { data } = await api.post("/orders", orderData, config);

      clearCart();
      toast.success("Commande passée avec succès !");
      navigate(`/orders/${data._id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la commande"
      );
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Finaliser la commande</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        {/* Formulaire de livraison */}
        <div>
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ marginBottom: "1.5rem" }}>Adresse de livraison</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nom complet *</label>
                <input
                  type="text"
                  className="form-input"
                  value={shippingAddress.name}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="20 123 456"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      phone: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Adresse *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Numéro et nom de rue"
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      street: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="form-group">
                  <label className="form-label">Ville *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Code postal</label>
                  <input
                    type="text"
                    className="form-input"
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        postalCode: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Informations supplémentaires (optionnel)
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Étage, bâtiment, point de repère..."
                  value={shippingAddress.additionalInfo}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      additionalInfo: e.target.value,
                    })
                  }
                  rows="3"
                />
              </div>
            </form>
          </div>

          {/* Mode de paiement */}
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <h2 style={{ marginBottom: "1.5rem" }}>Mode de paiement</h2>
            <div
              className="alert alert-info"
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <FiCreditCard style={{ fontSize: "2rem" }} />
              <div>
                <strong>Paiement à la livraison</strong>
                <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                  Vous paierez en espèces lors de la réception de votre commande
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div>
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              position: "sticky",
              top: "100px",
            }}
          >
            <h3 style={{ marginBottom: "1.5rem" }}>Résumé de la commande</h3>

            {/* Articles */}
            <div style={{ marginBottom: "1.5rem" }}>
              {cartItems.map((item, index) => {
                const product = item.product || {};
                const quantity = item.quantity || 1;

                const unitPrice =
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

                const rawImage =
                  product.images && product.images[0]
                    ? product.images[0]
                    : product.image || null;

                const imageSrc = rawImage
                  ? getImageUrl(rawImage)
                  : "https://placehold.co/60x60?text=Img";

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                      paddingBottom: "0.75rem",
                      borderBottom: "1px solid var(--gray-200)",
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt={product.nom}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: "var(--radius-sm)",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600" }}>{product.nom}</div>
                      <small style={{ color: "var(--gray-600)" }}>
                        {item.size} | {item.color} | Qté: {quantity}
                      </small>
                    </div>
                    <div style={{ fontWeight: "600" }}>
                      {(unitPrice * quantity).toFixed(2)} DT
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totaux */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
              }}
            >
              <span>Sous-total</span>
              <span>{getCartTotal().toFixed(2)} DT</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                paddingBottom: "1rem",
                borderBottom: "2px solid var(--gray-200)",
              }}
            >
              <span>Livraison</span>
              <span>
                {getShippingCost() === 0
                  ? "GRATUIT"
                  : `${getShippingCost().toFixed(2)} DT`}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "2rem",
              }}
            >
              <span>Total</span>
              <span style={{ color: "var(--primary)" }}>
                {getFinalTotal().toFixed(2)} DT
              </span>
            </div>

            <button
              onClick={handleSubmit}
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Traitement..." : "Confirmer la commande"}
            </button>

            <p
              style={{
                marginTop: "1rem",
                fontSize: "0.875rem",
                color: "var(--gray-600)",
                textAlign: "center",
              }}
            >
              En passant commande, vous acceptez nos conditions générales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
