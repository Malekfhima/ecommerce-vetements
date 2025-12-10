import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiEye } from "react-icons/fi";

const AdminOrders = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const params = filter ? `?status=${filter}` : "";
      const { data } = await api.get(`/orders${params}`, config);

      setOrders(data.orders || []);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors du chargement");
      setLoading(false);
    }
  }, [user, filter]);

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
      toast.error("Accès refusé");
      return;
    }
    fetchOrders();
  }, [fetchOrders, isAdmin, navigate]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put(`/orders/${orderId}/status`, { status: newStatus }, config);

      toast.success("Statut mis à jour !");
      fetchOrders();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      en_attente: "badge badge-warning",
      confirmee: "badge badge-primary",
      en_preparation: "badge badge-primary",
      expediee: "badge badge-primary",
      livree: "badge badge-success",
      annulee: "badge badge-danger",
    };

    const labels = {
      en_attente: "En attente",
      confirmee: "Confirmée",
      en_preparation: "En préparation",
      expediee: "Expédiée",
      livree: "Livrée",
      annulee: "Annulée",
    };

    return <span className={badges[status]}>{labels[status]}</span>;
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="container">
      <h1>Gestion des Commandes</h1>

      <div style={{ marginBottom: "2rem" }}>
        <select
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: "300px" }}
        >
          <option value="">Toutes les commandes</option>
          <option value="en_attente">En attente</option>
          <option value="confirmee">Confirmée</option>
          <option value="en_preparation">En préparation</option>
          <option value="expediee">Expédiée</option>
          <option value="livree">Livrée</option>
          <option value="annulee">Annulée</option>
        </select>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "var(--radius)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "var(--gray-100)" }}>
            <tr>
              <th style={{ padding: "1rem", textAlign: "left" }}>
                N° Commande
              </th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Client</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Date</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Total</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Statut</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Action</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Détails</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const subtotal =
                typeof order.subtotal === "number" ? order.subtotal : 0;

              const shipping =
                typeof order.shippingCost === "number"
                  ? order.shippingCost
                  : typeof order.fraisLivraison === "number"
                  ? order.fraisLivraison
                  : 0;

              const fallbackTotal =
                typeof order.montantTotal === "number"
                  ? order.montantTotal + shipping
                  : subtotal + shipping;

              const total =
                typeof order.totalAmount === "number"
                  ? order.totalAmount
                  : fallbackTotal;

              return (
                <tr
                  key={order._id}
                  style={{ borderBottom: "1px solid var(--gray-200)" }}
                >
                  <td style={{ padding: "1rem", fontWeight: "600" }}>
                    {order.orderNumber}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {order.user?.name}
                    <br />
                    <small style={{ color: "var(--gray-600)" }}>
                      {order.user?.email}
                    </small>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td style={{ padding: "1rem", fontWeight: "600" }}>
                    {total.toFixed(2)} DT
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {getStatusBadge(order.status)}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {order.status !== "livree" &&
                      order.status !== "annulee" && (
                        <select
                          className="form-select"
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order._id, e.target.value)
                          }
                          style={{ fontSize: "0.875rem" }}
                        >
                          <option value="en_attente">En attente</option>
                          <option value="confirmee">Confirmée</option>
                          <option value="en_preparation">En préparation</option>
                          <option value="expediee">Expédiée</option>
                          <option value="livree">Livrée</option>
                          <option value="annulee">Annulée</option>
                        </select>
                      )}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <Link
                      to={`/orders/${order._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      <FiEye /> Voir
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "var(--gray-500)",
            }}
          >
            Aucune commande trouvée
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
