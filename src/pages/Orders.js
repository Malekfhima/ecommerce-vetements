import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { getImageUrl } from "../utils/imageUrl";

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/orders/myorders`, config);
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/orders");
      return;
    }
    if (user) {
      fetchOrders();
    }
  }, [fetchOrders, isAuthenticated, navigate, user]);

  const getStatutBadge = (statusOrStatut) => {
    const statut = statusOrStatut || "";
    const badges = {
      en_attente: "badge-warning",
      confirmee: "badge-info",
      en_preparation: "badge-primary",
      expediee: "badge-secondary",
      livree: "badge-success",
      annulee: "badge-danger",
    };
    return badges[statut] || "badge-default";
  };

  const getStatutText = (statusOrStatut) => {
    const statut = statusOrStatut || "";
    const texts = {
      en_attente: "En attente",
      confirmee: "Confirmée",
      en_preparation: "En préparation",
      expediee: "Expédiée",
      livree: "Livrée",
      annulee: "Annulée",
    };
    return texts[statut] || statut;
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1>Mes Commandes</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>Vous n'avez pas encore de commandes</p>
            <Link to="/products" className="btn btn-primary">
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const status = order.status || order.statut;

              const produits = order.items || order.produits || [];

              const subtotal =
                typeof order.subtotal === "number"
                  ? order.subtotal
                  : typeof order.montantTotal === "number"
                  ? order.montantTotal
                  : 0;

              const shipping =
                typeof order.shippingCost === "number"
                  ? order.shippingCost
                  : typeof order.fraisLivraison === "number"
                  ? order.fraisLivraison
                  : 0;

              const total =
                typeof order.totalAmount === "number"
                  ? order.totalAmount
                  : subtotal + shipping;

              return (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>
                        Commande #{order.orderNumber || order._id?.slice(-8)}
                      </h3>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <span className={`badge ${getStatutBadge(status)}`}>
                      {getStatutText(status)}
                    </span>
                  </div>

                  <div className="order-products">
                    {produits.map((item, index) => {
                      const name =
                        item.nom ||
                        item.name ||
                        item.product?.nom ||
                        item.product?.name;
                      const quantity =
                        item.quantite || item.quantity || item.qty || 1;
                      const price =
                        typeof item.prix === "number"
                          ? item.prix
                          : typeof item.price === "number"
                          ? item.price
                          : typeof item.product?.prix === "number"
                          ? item.product.prix
                          : typeof item.product?.price === "number"
                          ? item.product.price
                          : 0;

                      const rawImage =
                        item.image ||
                        item.imageUrl ||
                        (item.product?.images && item.product.images[0]) ||
                        (item.product?.image && item.product.image);

                      const imageSrc = rawImage
                        ? getImageUrl(rawImage)
                        : "https://placehold.co/80x80?text=Img";

                      return (
                        <div key={index} className="order-product">
                          <img
                            src={imageSrc}
                            alt={name}
                            className="order-product-image"
                          />
                          <span>
                            {name} x {quantity}
                          </span>
                          <span>{(price * quantity).toFixed(2)} DT</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <strong>Total:</strong>
                      <strong>{total.toFixed(2)} DT</strong>
                    </div>
                    <Link to={`/orders/${order._id}`} className="btn btn-sm">
                      Voir détails
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
