import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import { Helmet } from "react-helmet";

import ProductCard from "../components/ProductCard";
import { FaFilter } from "react-icons/fa";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categorie: searchParams.get("categorie") || "",
    sousCategorie: searchParams.get("sousCategorie") || "",
    minPrix: "",
    maxPrix: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.categorie) params.categorie = filters.categorie;
      if (filters.sousCategorie) params.sousCategorie = filters.sousCategorie;
      if (filters.minPrix) params.minPrix = filters.minPrix;
      if (filters.maxPrix) params.maxPrix = filters.maxPrix;
      if (filters.search) params.search = filters.search;

      const { data } = await api.get("/products", { params });
      setProducts(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    if (name === "categorie" || name === "sousCategorie") {
      setSearchParams({ [name]: value });
    }
  };

  return (
    <div className="products-page">
      <Helmet>
        <title>Nos Produits - VêtementShop</title>
        <meta name="description" content="Parcourez notre catalogue de vêtements" />
      </Helmet>
      <div className="container">
        <div className="page-header">
          <h1>Nos Produits</h1>
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filtres
          </button>
        </div>

        <div className="products-content">
          <aside className={`filters ${showFilters ? "show" : ""}`}>
            <div className="filter-group">
              <h3>Recherche</h3>
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <div className="filter-group">
              <h3>Catégorie</h3>
              <select
                value={filters.categorie}
                onChange={(e) =>
                  handleFilterChange("categorie", e.target.value)
                }
              >
                <option value="">Toutes</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="enfant">Enfant</option>
                <option value="accessoires">Accessoires</option>
              </select>
            </div>

            <div className="filter-group">
              <h3>Sous-catégorie</h3>
              <select
                value={filters.sousCategorie}
                onChange={(e) =>
                  handleFilterChange("sousCategorie", e.target.value)
                }
              >
                <option value="">Toutes</option>
                <option value="t-shirt">T-shirt</option>
                <option value="pantalon">Pantalon</option>
                <option value="robe">Robe</option>
                <option value="jupe">Jupe</option>
                <option value="veste">Veste</option>
                <option value="chaussures">Chaussures</option>
                <option value="sac">Sac</option>
              </select>
            </div>

            <div className="filter-group">
              <h3>Prix</h3>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrix}
                  onChange={(e) =>
                    handleFilterChange("minPrix", e.target.value)
                  }
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrix}
                  onChange={(e) =>
                    handleFilterChange("maxPrix", e.target.value)
                  }
                />
              </div>
            </div>
          </aside>

          <div className="products-list">
            {loading ? (
              <div className="loading">Chargement...</div>
            ) : products.length === 0 ? (
              <div className="no-products">Aucun produit trouvé</div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
