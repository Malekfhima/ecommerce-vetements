import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const STATUTS = [
  "en_attente",
  "confirmee",
  "en_preparation",
  "expediee",
  "livree",
  "annulee",
];

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`${API_URL}/orders`, config);
        setOrders(data);
      } catch (error) {
        toast.error("Erreur lors du chargement des commandes");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleChangeStatus = async (orderId, newStatus) => {
    if (!newStatus) return;
    setUpdatingId(orderId);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        { statut: newStatus },
        config
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, statut: data.statut } : o))
      );
      toast.success("Statut de la commande mis à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatutLabel = (statut) => {
    const map = {
      en_attente: "En attente",
      confirmee: "Confirmée",
      en_preparation: "En préparation",
      expediee: "Expédiée",
      livree: "Livrée",
      annulee: "Annulée",
    };
    return map[statut] || statut;
  };

  if (loading) {
    return <div className="loading">Chargement des commandes...</div>;
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Commandes</h1>
      </div>

      {orders.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-8)}</td>
                  <td>
                    {order.user?.nom} {order.user?.prenom}
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td>
                    {(order.montantTotal + order.fraisLivraison).toFixed(2)} DT
                  </td>
                  <td>
                    <select
                      value={order.statut}
                      onChange={(e) =>
                        handleChangeStatus(order._id, e.target.value)
                      }
                      disabled={updatingId === order._id}
                    >
                      {STATUTS.map((s) => (
                        <option key={s} value={s}>
                          {getStatutLabel(s)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
