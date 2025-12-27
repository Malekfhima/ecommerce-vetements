import React, { useState } from 'react';
import axios from 'axios';
import './CreateArticle.css';

const CreateArticle = () => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    categorie: 'Homme',
    taille: 'M',
    couleur: '',
    stock: 0
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Gérer les changements des inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer le changement d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'L\'image ne doit pas dépasser 5MB' });
        return;
      }
      
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Veuillez sélectionner une image valide' });
        return;
      }
      
      setImage(file);
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Créer un FormData pour envoyer l'image
    const data = new FormData();
    data.append('nom', formData.nom);
    data.append('description', formData.description);
    data.append('prix', formData.prix);
    data.append('categorie', formData.categorie);
    data.append('taille', formData.taille);
    data.append('couleur', formData.couleur);
    data.append('stock', formData.stock);
    data.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/api/articles', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: '✅ Article créé avec succès!' });
        
        // Réinitialiser le formulaire
        setFormData({
          nom: '',
          description: '',
          prix: '',
          categorie: 'Homme',
          taille: 'M',
          couleur: '',
          stock: 0
        });
        setImage(null);
        setPreview(null);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || '❌ Erreur lors de la création de l\'article' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-article-container">
      <div className="create-article-card">
        <h2>Créer un nouvel article</h2>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nom">Nom de l'article *</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              placeholder="Ex: T-shirt Nike"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Décrivez l'article..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prix">Prix (TND) *</label>
              <input
                type="number"
                id="prix"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categorie">Catégorie *</label>
              <select
                id="categorie"
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                required
              >
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Enfant">Enfant</option>
                <option value="Accessoires">Accessoires</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="taille">Taille</label>
              <select
                id="taille"
                name="taille"
                value={formData.taille}
                onChange={handleChange}
              >
                <option value="">Choisir...</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="couleur">Couleur</label>
            <input
              type="text"
              id="couleur"
              name="couleur"
              value={formData.couleur}
              onChange={handleChange}
              placeholder="Ex: Bleu, Rouge, Noir..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image *</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Prévisualisation" />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'Créer l\'article'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;