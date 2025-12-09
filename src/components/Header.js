import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiPackage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const cartCount = getCartCount();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <FiPackage /> VêtementShop
          </Link>

          <nav className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Accueil
            </Link>
            <Link to="/products" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Produits
            </Link>
            {isAdmin() && (
              <>
                <Link to="/admin/products" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Admin Produits
                </Link>
                <Link to="/admin/orders" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Admin Commandes
                </Link>
              </>
            )}
          </nav>

          <div className="nav-icons">
            <Link to="/cart" className="icon-btn" title="Panier">
              <FiShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {user ? (
              <>
                <Link to="/profile" className="icon-btn" title="Profil">
                  <FiUser />
                </Link>
                <Link to="/orders" className="icon-btn" title="Mes commandes">
                  <FiPackage />
                </Link>
                <button onClick={handleLogout} className="icon-btn" title="Déconnexion">
                  <FiLogOut />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Connexion
              </Link>
            )}

            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
              <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Produits</Link>
              {isAdmin() && (
                <>
                  <Link to="/admin/products" onClick={() => setMobileMenuOpen(false)}>
                    Admin Produits
                  </Link>
                  <Link to="/admin/orders" onClick={() => setMobileMenuOpen(false)}>
                    Admin Commandes
                  </Link>
                </>
              )}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profil</Link>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>Mes commandes</Link>
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Connexion</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Inscription</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;