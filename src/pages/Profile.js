import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Profile = () => {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/profile");
      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      address: {
        street: user.address?.street || "",
        city: user.address?.city || "",
        postalCode: user.address?.postalCode || "",
      },
    });
  }, [user, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await updateProfile(updateData);
      setFormData({ ...formData, password: "" });
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "700px", paddingTop: "2rem" }}
    >
      <h1>Mon Profil</h1>

      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "var(--radius-lg)",
          marginTop: "2rem",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <FiUser style={{ marginRight: "0.5rem" }} />
              Nom complet
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiMail style={{ marginRight: "0.5rem" }} />
              Email
            </label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              disabled
              style={{ background: "var(--gray-100)", cursor: "not-allowed" }}
            />
            <small style={{ color: "var(--gray-600)" }}>
              L'email ne peut pas être modifié
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiPhone style={{ marginRight: "0.5rem" }} />
              Téléphone
            </label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiMapPin style={{ marginRight: "0.5rem" }} />
              Adresse
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Rue"
              value={formData.address.street}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value },
                })
              }
              style={{ marginBottom: "0.5rem" }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "0.5rem",
              }}
            >
              <input
                type="text"
                className="form-input"
                placeholder="Ville"
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value },
                  })
                }
              />
              <input
                type="text"
                className="form-input"
                placeholder="Code postal"
                value={formData.address.postalCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      postalCode: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Nouveau mot de passe (optionnel)
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Laisser vide pour ne pas changer"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
