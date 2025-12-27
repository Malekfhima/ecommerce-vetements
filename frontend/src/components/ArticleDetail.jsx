import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ArticleDetail.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/articles/${id}`);
      
      if (response.data.success) {
        setArticle(response.data.article);
      } else {
        setError('Article non trouvé');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement de l\'article');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implémenter l'ajout au panier
    alert(`Article "${article.nom}" ajouté au panier!`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>❌ {error}</h2>
        <button onClick={() => navigate('/')} className="btn-back">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="error-container">
        <h2>Article non trouvé</h2>
        <button onClick={() => navigate('/')} className="btn-back">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="article-detail-container">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Retour
      </button>

      <div className="article-detail-card">
        <div className="article-image-section">
          <img
            src={`http://localhost:5000${article.image}`}
            alt={article.nom}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x500?text=Image+non+disponible';
            }}
          />
        </div>

        <div className="article-info-section">
          <h1 className="article-title">{article.nom}</h1>
          
          <div className="article-price">
            {article.prix.toFixed(2)} TND
          </div>

          <div className="article-category">
            <span className="badge">{article.categorie}</span>
          </div>

          <div className="article-description">
            <h3>Description</h3>
            <p>{article.description}</p>
          </div>

          <div className="article-details">
            {article.taille && (
              <div className="detail-item">
                <strong>Taille :</strong>
                <span className="size-badge">{article.taille}</span>
              </div>
            )}

            {article.couleur && (
              <div className="detail-item">
                <strong>Couleur :</strong>
                <span>{article.couleur}</span>
              </div>
            )}

            <div className="detail-item">
              <strong>Stock :</strong>
              <span className={article.stock > 0 ? 'in-stock' : 'out-stock'}>
                {article.stock > 0 ? `${article.stock} disponible(s)` : 'Rupture de stock'}
              </span>
            </div>
          </div>

          <button 
            className="btn-add-cart" 
            onClick={handleAddToCart}
            disabled={article.stock === 0}
          >
            {article.stock > 0 ? '🛒 Ajouter au panier' : 'Rupture de stock'}
          </button>

          <div className="article-meta">
            <p><small>Ajouté le : {new Date(article.createdAt).toLocaleDateString('fr-FR')}</small></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;