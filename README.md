# Site E-commerce de Vêtements - MERN Stack

Site web complet de vente de vêtements en ligne développé avec MongoDB, Express, React et Node.js.

## 🚀 Fonctionnalités

### Pour les Clients
- Inscription et connexion utilisateur
- Catalogue de produits avec filtres (catégorie, prix, recherche)
- Détails des produits avec sélection de taille et couleur
- Panier d'achat avec gestion des quantités
- Processus de commande complet
- Suivi des commandes
- Gestion du profil utilisateur

### Pour les Administrateurs
- Gestion complète des produits (CRUD)
- Visualisation de toutes les commandes
- Mise à jour du statut des commandes

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- MongoDB installé et en cours d'exécution sur localhost
- npm ou yarn

## 🛠️ Installation

### 1. Cloner ou créer la structure du projet

```bash
mkdir ecommerce-vetements
cd ecommerce-vetements
```

### 2. Installation du Backend

```bash
# Créer le dossier backend
mkdir backend
cd backend

# Installer les dépendances
npm install express mongoose cors dotenv bcryptjs jsonwebtoken express-validator nodemon

# Créer tous les fichiers du backend (selon les artefacts fournis)
# - server.js
# - .env
# - config/db.js
# - models/ (User.js, Product.js, Order.js)
# - controllers/ (authController.js, productController.js, orderController.js)
# - routes/ (authRoutes.js, productRoutes.js, orderRoutes.js)
# - middleware/auth.js
# - seedData.js

cd ..
```

### 3. Installation du Frontend

```bash
# Créer l'application React
npx create-react-app frontend
cd frontend

# Installer les dépendances supplémentaires
npm install react-router-dom axios react-icons react-toastify

# Remplacer les fichiers par ceux fournis:
# - src/App.js
# - src/App.css
# - src/index.js
# - src/index.css
# - src/context/ (AuthContext.js, CartContext.js)
# - src/components/ (Header.js, Footer.js, ProductCard.js)
# - src/pages/ (toutes les pages)

cd ..
```

### 4. Configuration de MongoDB

```bash
# Démarrer MongoDB
mongod

# Dans un nouveau terminal, initialiser la base de données avec des données de test
cd backend
node seedData.js
```

## 🚀 Démarrage

### Démarrer le Backend (Port 5000)

```bash
cd backend
npm run dev
# ou
npm start
```

### Démarrer le Frontend (Port 3000)

```bash
cd frontend
npm start
```

## 📁 Structure du Projet

```
ecommerce-vetements/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── .env
│   ├── server.js
│   ├── seedData.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Header.js
    │   │   ├── Footer.js
    │   │   └── ProductCard.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── CartContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Products.js
    │   │   ├── ProductDetail.js
    │   │   ├── Cart.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Profile.js
    │   │   ├── Checkout.js
    │   │   ├── Orders.js
    │   │   └── OrderDetail.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🔑 Comptes de Test

Après avoir exécuté `seedData.js`, vous pouvez utiliser ces comptes:

**Administrateur:**
- Email: admin@vetements.com
- Mot de passe: admin123

**Client:**
- Email: client@test.com
- Mot de passe: client123

## 🌐 Endpoints API

### Authentification
- POST `/api/auth/register` - Inscription
- POST `/api/auth/login` - Connexion
- GET `/api/auth/profile` - Profil utilisateur (protégé)
- PUT `/api/auth/profile` - Mise à jour profil (protégé)

### Produits
- GET `/api/products` - Liste des produits (avec filtres)
- GET `/api/products/:id` - Détails d'un produit
- GET `/api/products/featured` - Produits en vedette
- POST `/api/products` - Créer un produit (admin)
- PUT `/api/products/:id` - Modifier un produit (admin)
- DELETE `/api/products/:id` - Supprimer un produit (admin)

### Commandes
- POST `/api/orders` - Créer une commande (protégé)
- GET `/api/orders/myorders` - Mes commandes (protégé)
- GET `/api/orders/:id` - Détails d'une commande (protégé)
- GET `/api/orders` - Toutes les commandes (admin)
- PUT `/api/orders/:id/status` - Modifier statut (admin)

## 🎨 Personnalisation

### Modifier les couleurs
Éditez les variables CSS dans `frontend/src/App.css`:

```css
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --accent-color: #e74c3c;
  /* ... */
}
```

### Ajouter des produits
1. Via le script seedData.js
2. Via l'API avec un compte admin
3. Directement dans MongoDB

## 🔒 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Authentification par JWT
- Routes protégées par middleware
- Validation des données côté serveur

## 📱 Responsive Design

Le site est entièrement responsive et s'adapte à tous les écrans:
- Mobile (< 768px)
- Tablette (768px - 1024px)
- Desktop (> 1024px)

## 🐛 Dépannage

### MongoDB ne se connecte pas
```bash
# Vérifier que MongoDB est démarré
sudo systemctl status mongod
# ou
mongod --version
```

### Port déjà utilisé
```bash
# Changer le port dans backend/.env
PORT=5001
```

### Erreur CORS
Vérifiez que le proxy est configuré dans `frontend/package.json`:
```json
"proxy": "http://localhost:5000"
```

## 📝 Notes

- Les images des produits utilisent des placeholders. Remplacez-les par de vraies images.
- Adaptez les frais de livraison selon vos besoins dans les modèles.
- Configurez un vrai système de paiement (Stripe, PayPal) pour la production.

## 🚀 Déploiement

### Backend (Heroku, Railway, Render)
1. Créer un compte sur la plateforme
2. Connecter votre repository
3. Configurer les variables d'environnement
4. Utiliser MongoDB Atlas pour la production

### Frontend (Vercel, Netlify)
1. Build le projet: `npm run build`
2. Déployer le dossier `build/`
3. Configurer l'URL de l'API backend

## 📄 Licence

Ce projet est libre d'utilisation pour des fins d'apprentissage et commerciales.

## 👨‍💻 Support

Pour toute question ou problème, créez une issue ou contactez le support.

---

**Bon développement! 🎉**