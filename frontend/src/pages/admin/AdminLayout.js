import { Link, Routes, Route, Navigate } from "react-router-dom";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";

const AdminLayout = () => {
  return (
    <div className="admin-page">
      <div className="container admin-container">
        <aside className="admin-sidebar">
          <h2>Admin</h2>
          <nav>
            <Link to="products">Produits</Link>
            <Link to="orders">Commandes</Link>
          </nav>
        </aside>
        <section className="admin-content">
          <Routes>
            <Route path="" element={<Navigate to="products" replace />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Routes>
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
