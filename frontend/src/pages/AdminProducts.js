import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { getImageUrl } from "../utils/imageUrl";

const AdminProducts = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    categorie: "homme",
    sousCategorie: "",
    tailles: [],
    couleurs: [],
    stock: "",
    images: [],
    prixPromo: "",
    enVedette: false,
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.get("/products", config);
      // L'API renvoie directement un tableau de produits
      setProducts(Array.isArray(data) ? data : data.products || []);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors du chargement");
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
      toast.error("Accès refusé");
      return;
    }
    fetchProducts();
  }, [fetchProducts, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((v) => data.append(key, v));
          } else {
            data.append(key, value);
          }
        }
      });
      if (imageFile) {
        data.append("image", imageFile);
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data, {
          ...config,
          headers: {
            ...config.headers,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Produit mis à jour !");
      } else {
        await api.post("/products", data, {
          ...config,
          headers: {
            ...config.headers,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Produit créé !");
      }

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Erreur lors de la sauvegarde"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.delete(`/products/${id}`, config);
      toast.success("Produit supprimé");
      fetchProducts();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nom: product.nom,
      description: product.description,
      prix: product.prix,
      categorie: product.categorie,
      sousCategorie: product.sousCategorie || "",
      tailles: product.tailles || [],
      couleurs: product.couleurs || [],
      stock: product.stock,
      images: product.images,
      prixPromo: product.prixPromo || "",
      enVedette: product.enVedette || false,
    });
    setImageFile(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      prix: "",
      categorie: "homme",
      sousCategorie: "",
      tailles: [],
      couleurs: [],
      stock: "",
      images: [],
      prixPromo: "",
      enVedette: false,
    });
    setImageFile(null);
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="container">
      <div className="flex-between mb-3">
        <h1>Gestion des Produits</h1>
        <button
          onClick={() => {
            setShowForm(true);
            resetForm();
            setEditingProduct(null);
          }}
          className="btn btn-primary"
        >
          <FiPlus /> Ajouter un produit
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "var(--radius)",
            marginBottom: "2rem",
          }}
        >
          <h2>{editingProduct ? "Modifier" : "Nouveau"} Produit</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input
                type="text"
                className="form-input"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image du produit</label>
              <input
                type="file"
                accept="image/*"
                className="form-input"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label className="form-label">Prix (DT)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.prix}
                  onChange={(e) =>
                    setFormData({ ...formData, prix: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Catégorie</label>
                <select
                  className="form-select"
                  value={formData.categorie}
                  onChange={(e) =>
                    setFormData({ ...formData, categorie: e.target.value })
                  }
                >
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="enfant">Enfant</option>
                  <option value="accessoires">Accessoires</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sous-catégorie</label>
                <select
                  className="form-select"
                  value={formData.sousCategorie}
                  onChange={(e) =>
                    setFormData({ ...formData, sousCategorie: e.target.value })
                  }
                  required
                >
                  <option value="">Choisir...</option>
                  <option value="t-shirt">T-shirt</option>
                  <option value="pantalon">Pantalon</option>
                  <option value="robe">Robe</option>
                  <option value="jupe">Jupe</option>
                  <option value="veste">Veste</option>
                  <option value="chaussures">Chaussures</option>
                  <option value="sac">Sac</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Prix promo (DT)</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.prixPromo}
                  onChange={(e) =>
                    setFormData({ ...formData, prixPromo: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tailles (maintenir Ctrl pour plusieurs)</label>
              <select
                multiple
                className="form-select"
                value={formData.tailles}
                onChange={(e) => {
                  const options = [...e.target.selectedOptions];
                  const values = options.map((option) => option.value);
                  setFormData({ ...formData, tailles: values });
                }}
                style={{ height: "100px" }}
              >
                {["XS", "S", "M", "L", "XL", "XXL", "36", "38", "40", "42", "44"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Couleurs (séparées par des virgules)</label>
              <input
                type="text"
                className="form-input"
                value={formData.couleurs.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    couleurs: e.target.value.split(",").map((c) => c.trim()),
                  })
                }
                placeholder="Ex: Rouge, Bleu, Noir"
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button type="submit" className="btn btn-primary">
                {editingProduct ? "Mettre à jour" : "Créer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="btn btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

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
              <th style={{ padding: "1rem", textAlign: "left" }}>Produit</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Prix</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Stock</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Catégorie</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                style={{ borderBottom: "1px solid var(--gray-200)" }}
              >
                <td style={{ padding: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.nom}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <span>{product.nom}</span>
                  </div>
                </td>
                <td style={{ padding: "1rem" }}>{product.prix} DT</td>
                <td style={{ padding: "1rem" }}>{product.stock}</td>
                <td style={{ padding: "1rem" }}>{product.categorie}</td>
                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn btn-sm btn-secondary"
                    style={{ marginRight: "0.5rem" }}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn btn-sm btn-danger"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
