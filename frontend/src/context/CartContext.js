import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Charger le panier depuis localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Ajouter un article au panier
  const addToCart = (product, quantity = 1, size = "", color = "") => {
    const existingItem = cartItems.find(
      (item) =>
        item.product._id === product._id &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      // Mettre à jour la quantité
      setCartItems(
        cartItems.map((item) =>
          item.product._id === product._id &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
      toast.success("Quantité mise à jour dans le panier");
    } else {
      // Ajouter un nouvel article
      setCartItems([...cartItems, { product, quantity, size, color }]);
      toast.success("Article ajouté au panier !");
    }
  };

  // Retirer un article du panier
  const removeFromCart = (productId, size, color) => {
    setCartItems(
      cartItems.filter(
        (item) =>
          !(
            item.product._id === productId &&
            item.size === size &&
            item.color === color
          )
      )
    );
    toast.info("Article retiré du panier");
  };

  // Mettre à jour la quantité
  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.product._id === productId &&
        item.size === size &&
        item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Vider le panier
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    toast.success("Panier vidé");
  };

  // Calculer le total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const p = item.product || {};

      // Supporter à la fois les champs anglais (price, discount)
      // et français (prix, prixPromo)
      const basePrice =
        typeof p.prixPromo === "number" && !Number.isNaN(p.prixPromo)
          ? p.prixPromo
          : typeof p.prix === "number" && !Number.isNaN(p.prix)
          ? p.prix
          : typeof p.price === "number" && !Number.isNaN(p.price)
          ? p.price
          : 0;

      const discount =
        typeof p.discount === "number" && p.discount > 0 && p.discount < 100
          ? p.discount
          : 0;

      const finalPrice =
        discount > 0 ? basePrice * (1 - discount / 100) : basePrice;

      return total + finalPrice * item.quantity;
    }, 0);
  };

  // Calculer le nombre total d'articles
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Obtenir les frais de livraison (gratuit au-dessus de 100 DT)
  const getShippingCost = () => {
    const total = getCartTotal();
    return total >= 100 ? 0 : 7.0;
  };

  // Calculer le total avec livraison
  const getFinalTotal = () => {
    return getCartTotal() + getShippingCost();
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getShippingCost,
    getFinalTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
