import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaStar, FaMinus, FaPlus } from "react-icons/fa";
import { getImageUrl } from "../utils/imageUrl";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedTaille, setSelectedTaille] = useState("");
  const [selectedCouleur, setSelectedCouleur] = useState("");
  const [quantite, setQuantite] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await api.get(`/products/${id}`);

      setProduct(data);
      if (data.tailles && data.tailles.length > 0)
        setSelectedTaille(data.tailles[0]);
      if (data.couleurs && data.couleurs.length > 0)
        setSelectedCouleur(data.couleurs[0]);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Produit non trouvé");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (!selectedTaille || !selectedCouleur) {
      toast.error("Veuillez sélectionner une taille et une couleur");
      return;
    }

    addToCart(product, quantite, selectedTaille, selectedCouleur);
    toast.success("Produit ajouté au panier");
  };

  const handleRateProduct = async (note) => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour noter ce produit");
      return;
    }

    try {
      setRatingLoading(true);
      const { data } = await api.post(`/products/${product._id}/rate`, {
        note,
      });
      setProduct(data);
      setUserRating(note);
      toast.success("Merci pour votre note !");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de l'envoi de la note"
      );
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (!product) return <div>Produit non trouvé</div>;

  const displayPrice = product.prixPromo || product.prix;
  const hasPromo = product.prixPromo && product.prixPromo < product.prix;
  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => getImageUrl(img))
      : ["https://placehold.co/600x800?text=Vêtement"];

  return (
    <div className="product-detail">
      <Helmet>
        <title>{product.nom} - VêtementShop</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <div className="container">
        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              {hasPromo && <span className="promo-badge">PROMO</span>}
              <img src={images[selectedImage]} alt={product.nom} />
            </div>
            {images.length > 1 && (
              <div className="thumbnail-images">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.nom} ${index + 1}`}
                    className={selectedImage === index ? "active" : ""}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-details">
            <h1>{product.nom}</h1>

            <div className="product-rating-block">
              <div className="product-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < Math.round(product.note) ? "#f59e0b" : "#e5e7eb"}
                  />
                ))}
                <span className="rating-text">
                  {product.note.toFixed(1)} / 5 · {product.nombreAvis} avis
                </span>
              </div>

              <div className="user-rating">
                <span className="user-rating-label">Votre note :</span>
                <div className="user-rating-stars">
                  {[...Array(5)].map((_, i) => {
                    const starValue = i + 1;
                    const active =
                      starValue <= (hoverRating || userRating || 0);
                    return (
                      <button
                        key={starValue}
                        type="button"
                        className="star-button"
                        onClick={() => handleRateProduct(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        disabled={ratingLoading}
                      >
                        <FaStar color={active ? "#f59e0b" : "#e5e7eb"} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="product-price">
              <span className="current-price">
                {displayPrice.toFixed(2)} DT
              </span>
              {hasPromo && (
                <span className="old-price">{product.prix.toFixed(2)} DT</span>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            {product.marque && (
              <p className="product-brand">
                <strong>Marque:</strong> {product.marque}
              </p>
            )}

            <div className="product-options">
              <div className="option-group">
                <label>Taille:</label>
                <div className="size-selector">
                  {product.tailles.map((taille) => (
                    <button
                      key={taille}
                      className={selectedTaille === taille ? "active" : ""}
                      onClick={() => setSelectedTaille(taille)}
                    >
                      {taille}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label>Couleur:</label>
                <div className="color-selector">
                  {product.couleurs.map((couleur) => (
                    <button
                      key={couleur}
                      className={selectedCouleur === couleur ? "active" : ""}
                      onClick={() => setSelectedCouleur(couleur)}
                      style={{ backgroundColor: couleur.toLowerCase() }}
                      title={couleur}
                    >
                      {selectedCouleur === couleur && "✓"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label>Quantité:</label>
                <div className="quantity-selector">
                  <button
                    onClick={() => quantite > 1 && setQuantite(quantite - 1)}
                  >
                    <FaMinus />
                  </button>
                  <span>{quantite}</span>
                  <button
                    onClick={() =>
                      quantite < product.stock && setQuantite(quantite + 1)
                    }
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>

            <div className="product-actions">
              {product.stock > 0 ? (
                <button className="btn btn-primary" onClick={handleAddToCart}>
                  Ajouter au panier
                </button>
              ) : (
                <button className="btn btn-disabled" disabled>
                  Rupture de stock
                </button>
              )}
            </div>

            <div className="product-info">
              <p>
                <strong>Stock disponible:</strong> {product.stock} unités
              </p>
              <p>
                <strong>Catégorie:</strong> {product.categorie} -{" "}
                {product.sousCategorie}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
