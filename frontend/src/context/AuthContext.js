import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur depuis sessionStorage au démarrage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error);
        sessionStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Connexion
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data);
      sessionStorage.setItem("user", JSON.stringify(data));
      toast.success("Connexion réussie !");
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de la connexion";
      toast.error(message);
      throw error;
    }
  };

  // Inscription
  const register = async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      setUser(data);
      sessionStorage.setItem("user", JSON.stringify(data));
      toast.success("Compte créé avec succès !");
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de l'inscription";
      toast.error(message);
      throw error;
    }
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    toast.info("Vous êtes déconnecté");
  };

  // Mettre à jour le profil
  const updateProfile = async (userData) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await api.put("/auth/profile", userData, config);
      setUser(data);
      sessionStorage.setItem("user", JSON.stringify(data));
      toast.success("Profil mis à jour !");
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de la mise à jour";
      toast.error(message);
      throw error;
    }
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = () => {
    return user?.role === "admin";
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
