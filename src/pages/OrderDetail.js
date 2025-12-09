import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiPackage, FiMapPin, FiCreditCard, FiCheck } from "react-icons/fi";

const OrderDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await api.get(`/orders/${id}`, config);

      setOrder(data);
      setLoading(false);
    } catch (error) {
      toast.error("Commande non trouvée");
      navigate("/orders");
    }
  }, [id, user, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchOrder();
  }, [fetchOrder, isAuthenticated, navigate]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?"))
      return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await api.put(`/orders/${id}/cancel`, {}, config);

      toast.success("Commande annulée");
      fetchOrder();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de l'annulation"
      );
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      en_attente: "En attente de confirmation",
      confirmee: "Confirmée",
      en_preparation: "En cours de préparation",
      expediee: "Expédiée",
      livree: "Livrée",
      annulee: "Annulée",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      en_attente: "var(--warning)",
      confirmee: "var(--primary)",
      en_preparation: "var(--primary)",
      expediee: "var(--primary)",
      livree: "var(--success)",
      annulee: "var(--danger)",
    };
    return colors[status] || "var(--gray-500)";
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (!order) return <div className="container">Commande non trouvée</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Commande {order.orderNumber}</h1>
        <p style={{ color: "var(--gray-600)" }}>
          Passée le{" "}
          {new Date(order.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Statut de la commande */}
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "var(--radius-lg)",
          marginBottom: "2rem",
          border: `3px solid ${getStatusColor(order.status)}`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 1rem",
              background: getStatusColor(order.status),
              color: "white",
              borderRadius: "var(--radius-full)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
            }}
          >
            {order.status === "livree" ? <FiCheck /> : <FiPackage />}
          </div>
          <h2
            style={{
              marginBottom: "0.5rem",
              color: getStatusColor(order.status),
            }}
          >
            {getStatusLabel(order.status)}
          </h2>
          {order.status !== "livree" && order.status !== "annulee" && (
            <p style={{ color: "var(--gray-600)" }}>
              Votre commande est en cours de traitement
            </p>
          )}
        </div>

        {/* Timeline */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div
            style={{
              marginTop: "2rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--gray-200)",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>Historique</h3>
            {order.statusHistory.map((history, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginBottom: "1rem",
                  paddingLeft: "1rem",
                  borderLeft: "3px solid var(--gray-300)",
                }}
              >
                <div>
                  <strong>{getStatusLabel(history.status)}</strong>
                  <p style={{ color: "var(--gray-600)", fontSize: "0.9rem" }}>
                    {new Date(history.date).toLocaleString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton annuler */}
        {!["expediee", "livree", "annulee"].includes(order.status) && (
          <button
            onClick={handleCancelOrder}
            className="btn btn-danger"
            style={{ marginTop: "1rem", width: "100%" }}
          >
            Annuler la commande
          </button>
        )}
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}
      >
        {/* Articles commandés */}
        <div>
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <h3 style={{ marginBottom: "1.5rem" }}>Articles commandés</h3>
            {order.items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  padding: "1rem 0",
                  borderBottom:
                    index < order.items.length - 1
                      ? "1px solid var(--gray-200)"
                      : "none",
                }}
              >
                <img
                  src={item.image || "https://placehold.co/100x100?text=Img"}
                  alt={item.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "var(--radius)",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4>{item.name}</h4>
                  <p style={{ color: "var(--gray-600)", marginTop: "0.5rem" }}>
                    Taille: {item.size} | Couleur: {item.color}
                  </p>
                  <p style={{ marginTop: "0.5rem" }}>
                    Quantité: {item.quantity}
                  </p>
                </div>
                <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>
                  {(item.price * item.quantity).toFixed(2)} DT
                </div>
              </div>
            ))}
          </div>

          {/* Adresse de livraison */}
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              marginTop: "2rem",
            }}
          >
            <h3
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FiMapPin /> Adresse de livraison
            </h3>
            <p>
              <strong>{order.shippingAddress.name}</strong>
            </p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city} {order.shippingAddress.postalCode}
            </p>
            {order.shippingAddress.additionalInfo && (
              <p style={{ color: "var(--gray-600)", marginTop: "0.5rem" }}>
                {order.shippingAddress.additionalInfo}
              </p>
            )}
          </div>

          {/* Mode de paiement */}
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              marginTop: "2rem",
            }}
          >
            <h3
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FiCreditCard /> Mode de paiement
            </h3>
            <p>Paiement à la livraison (en espèces)</p>
            {order.isPaid && (
              <div
                className="alert alert-success"
                style={{ marginTop: "1rem" }}
              >
                Payé le {new Date(order.paidAt).toLocaleDateString("fr-FR")}
              </div>
            )}
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
            <h3 style={{ marginBottom: "1.5rem" }}>Résumé</h3>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
              }}
            >
              <span>Sous-total</span>
              <span>{order.subtotal.toFixed(2)} DT</span>
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
                {order.shippingCost === 0
                  ? "GRATUIT"
                  : `${order.shippingCost.toFixed(2)} DT`}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
            >
              <span>Total</span>
              <span style={{ color: "var(--primary)" }}>
                {order.totalAmount.toFixed(2)} DT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
