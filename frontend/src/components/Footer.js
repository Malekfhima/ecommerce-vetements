import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>VêtementShop</h3>
            <p>Votre destination mode en ligne</p>
            <div className="social-links">
              <a href="/"><FaFacebook /></a>
              <a href="/"><FaInstagram /></a>
              <a href="/"><FaTwitter /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Liens Rapides</h4>
            <ul>
              <li><a href="/">Accueil</a></li>
              <li><a href="/products">Produits</a></li>
              <li><a href="/about">À propos</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Catégories</h4>
            <ul>
              <li><a href="/products?categorie=homme">Homme</a></li>
              <li><a href="/products?categorie=femme">Femme</a></li>
              <li><a href="/products?categorie=enfant">Enfant</a></li>
              <li><a href="/products?categorie=accessoires">Accessoires</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Service Client</h4>
            <ul>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/shipping">Livraison</a></li>
              <li><a href="/returns">Retours</a></li>
              <li><a href="/terms">Conditions</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 VêtementShop. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;