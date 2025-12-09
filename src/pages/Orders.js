import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/orders/myorders`, config);
      setOrders(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatutBadge = (statut) => {
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

  const getStatutText = (statut) => {
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
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Commande #{order._id.slice(-8)}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className={`badge ${getStatutBadge(order.statut)}`}>
                    {getStatutText(order.statut)}
                  </span>
                </div>

                <div className="order-products">
                  {order.produits.map((item, index) => (
                    <div key={index} className="order-product">
                      <span>
                        {item.nom} x {item.quantite}
                      </span>
                      <span>{(item.prix * item.quantite).toFixed(2)} DT</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total:</strong>
                    <strong>
                      {(order.montantTotal + order.fraisLivraison).toFixed(2)}{" "}
                      DT
                    </strong>
                  </div>
                  <Link to={`/orders/${order._id}`} className="btn btn-sm">
                    Voir détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
