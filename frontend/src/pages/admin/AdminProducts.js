import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const emptyForm = {
  nom: "",
  description: "",
  prix: "",
  prixPromo: "",
  categorie: "homme",
  sousCategorie: "t-shirt",
  tailles: "",
  couleurs: "",
  stock: "",
  images: "",
  marque: "",
  enVedette: false,
};

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchProducts = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/products`, config);
      setProducts(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const resetForm = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nom: product.nom || "",
      description: product.description || "",
      prix: product.prix?.toString() || "",
      prixPromo: product.prixPromo?.toString() || "",
      categorie: product.categorie || "homme",
      sousCategorie: product.sousCategorie || "t-shirt",
      tailles: (product.tailles || []).join(","),
      couleurs: (product.couleurs || []).join(","),
      stock: product.stock?.toString() || "",
      images: (product.images || []).join(","),
      marque: product.marque || "",
      enVedette: !!product.enVedette,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`${API_URL}/products/${id}`, config);
      toast.success("Produit supprimé");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      if (editingProduct && editingProduct._id === id) {
        resetForm();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du produit");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        nom: formData.nom,
        description: formData.description,
        prix: Number(formData.prix) || 0,
        prixPromo: formData.prixPromo ? Number(formData.prixPromo) : undefined,
        categorie: formData.categorie,
        sousCategorie: formData.sousCategorie,
        tailles: formData.tailles
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        couleurs: formData.couleurs
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        stock: Number(formData.stock) || 0,
        images: formData.images
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        marque: formData.marque || undefined,
        enVedette: formData.enVedette,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      if (editingProduct) {
        const { data } = await axios.put(
          `${API_URL}/products/${editingProduct._id}`,
          payload,
          config
        );
        toast.success("Produit mis à jour");
        setProducts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      } else {
        const { data } = await axios.post(
          `${API_URL}/products`,
          payload,
          config
        );
        toast.success("Produit créé");
        setProducts((prev) => [data, ...prev]);
      }

      resetForm();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Erreur lors de l'enregistrement du produit";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement des produits...</div>;
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Produits</h1>
      </div>

      <div className="admin-form">
        <h2>{editingProduct ? "Modifier un produit" : "Nouveau produit"}</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prix (DT)</label>
              <input
                type="number"
                name="prix"
                min="0"
                step="0.01"
                value={formData.prix}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Prix promo (DT)</label>
              <input
                type="number"
                name="prixPromo"
                min="0"
                step="0.01"
                value={formData.prixPromo}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Catégorie</label>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                required
              >
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="enfant">Enfant</option>
                <option value="accessoires">Accessoires</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sous-catégorie</label>
              <select
                name="sousCategorie"
                value={formData.sousCategorie}
                onChange={handleChange}
                required
              >
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
              <label>Marque</label>
              <input
                type="text"
                name="marque"
                value={formData.marque}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tailles (séparées par des virgules)</label>
            <input
              type="text"
              name="tailles"
              value={formData.tailles}
              onChange={handleChange}
              placeholder="Ex: S,M,L,XL"
            />
          </div>

          <div className="form-group">
            <label>Couleurs (séparées par des virgules)</label>
            <input
              type="text"
              name="couleurs"
              value={formData.couleurs}
              onChange={handleChange}
              placeholder="Ex: rouge,bleu,noir"
            />
          </div>

          <div className="form-group">
            <label>Images (URLs séparées par des virgules)</label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder="https://...,https://..."
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="enVedette"
                checked={formData.enVedette}
                onChange={handleChange}
              />
              Mettre en vedette
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? "Enregistrement..."
                : editingProduct
                ? "Mettre à jour"
                : "Créer le produit"}
            </button>
            {editingProduct && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <h2>Liste des produits</h2>

      {products.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Sous-catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Promo</th>
                <th>Vedette</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.nom}</td>
                  <td>{p.categorie}</td>
                  <td>{p.sousCategorie}</td>
                  <td>{p.prix.toFixed(2)} DT</td>
                  <td>{p.stock}</td>
                  <td>{p.prixPromo ? `${p.prixPromo.toFixed(2)} DT` : "-"}</td>
                  <td>{p.enVedette ? "Oui" : "Non"}</td>
                  <td>
                    <button
                      className="btn btn-sm"
                      type="button"
                      onClick={() => handleEdit(p)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      type="button"
                      onClick={() => handleDelete(p._id)}
                    >
                      Supprimer
                    </button>
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

export default AdminProducts;
