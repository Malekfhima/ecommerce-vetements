import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { Helmet } from "react-helmet";

import ProductCard from "../components/ProductCard";
import { FiTruck, FiShield, FiCreditCard, FiArrowRight } from "react-icons/fi";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await api.get("/products/featured");

      setFeaturedProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <Helmet>
        <title>VêtementShop - Accueil</title>
        <meta name="description" content="Découvrez notre collection de vêtements tendance pour toute la famille" />
      </Helmet>
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
          color: "white",
          padding: "4rem 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              marginBottom: "1.5rem",
            }}
          >
            Bienvenue chez VêtementShop
          </h1>
          <p
            style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}
          >
            Découvrez notre collection de vêtements tendance pour toute la
            famille
          </p>
          <Link
            to="/products"
            className="btn btn-lg"
            style={{
              background: "white",
              color: "var(--primary)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Découvrir la collection <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="features"
        style={{ padding: "3rem 0", background: "white" }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
            }}
          >
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 1.5rem",
                  background: "var(--gray-100)",
                  borderRadius: "var(--radius-full)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  color: "var(--primary)",
                }}
              >
                <FiTruck />
              </div>
              <h3 style={{ marginBottom: "0.75rem", fontWeight: "700" }}>
                Livraison Rapide
              </h3>
              <p style={{ color: "var(--gray-600)" }}>
                Livraison gratuite pour les commandes supérieures à 100 DT
              </p>
            </div>

            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 1.5rem",
                  background: "var(--gray-100)",
                  borderRadius: "var(--radius-full)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  color: "var(--success)",
                }}
              >
                <FiCreditCard />
              </div>
              <h3 style={{ marginBottom: "0.75rem", fontWeight: "700" }}>
                Paiement à la Livraison
              </h3>
              <p style={{ color: "var(--gray-600)" }}>
                Payez en espèces lors de la réception de votre commande
              </p>
            </div>

            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 1.5rem",
                  background: "var(--gray-100)",
                  borderRadius: "var(--radius-full)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  color: "var(--accent)",
                }}
              >
                <FiShield />
              </div>
              <h3 style={{ marginBottom: "0.75rem", fontWeight: "700" }}>
                Achat Sécurisé
              </h3>
              <p style={{ color: "var(--gray-600)" }}>
                Vos informations sont protégées et sécurisées
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products" style={{ padding: "3rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ fontSize: "2rem", fontWeight: "800" }}>
              Produits en Vedette
            </h2>
            <Link to="/products" className="btn btn-outline">
              Voir tout <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="loading">Chargement des produits...</div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div
              className="text-center"
              style={{ padding: "3rem", color: "var(--gray-500)" }}
            >
              Aucun produit en vedette pour le moment
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section
        className="categories"
        style={{ padding: "3rem 0", background: "white" }}
      >
        <div className="container">
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            Acheter par Catégorie
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              { name: "Homme", link: "/products?categorie=homme", emoji: "👔" },
              { name: "Femme", link: "/products?categorie=femme", emoji: "👗" },
              {
                name: "Enfant",
                link: "/products?categorie=enfant",
                emoji: "👶",
              },
              {
                name: "Accessoires",
                link: "/products?categorie=accessoires",
                emoji: "👜",
              },
            ].map((category) => (
              <Link
                key={category.name}
                to={category.link}
                style={{
                  background: "var(--gray-50)",
                  padding: "3rem 1.5rem",
                  borderRadius: "var(--radius-lg)",
                  textAlign: "center",
                  border: "2px solid var(--gray-200)",
                  transition: "var(--transition)",
                  textDecoration: "none",
                  color: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--gray-200)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  {category.emoji}
                </div>
                <h3 style={{ fontWeight: "700", fontSize: "1.25rem" }}>
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
