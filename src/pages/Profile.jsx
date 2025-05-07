import './Profile.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axiosConfig";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        setError("Error al cargar el perfil. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (error) {
    return (
      <Layout>
        <div className="profile-container">
          <div className="profile-box">
            <p className="profile-error">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="profile-container">
          <div className="profile-box">
            <p className="profile-loading">Cargando perfil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-box">
          <h1 className="profile-title">Perfil del Usuario</h1>

          <div className="profile-field">
            <label>Nombre de usuario:</label>
            <p className="profile-text">{user.nombre}</p>
          </div>

          <div className="profile-field">
            <label>Correo electrónico:</label>
            <p className="profile-text">{user.email}</p>
          </div>

          <div className="profile-actions">
            <button onClick={handleLogout} className="profile-button-logout">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
