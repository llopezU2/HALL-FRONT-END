import './Register.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axiosConfig";

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        nombre,
        email,
        contraseña: password, // según lo que espera tu backend
      });

      navigate("/login");
    } catch (err) {
      setError("Error al registrar. Por favor, intentá de nuevo.");
    }
  };

  return (
    <Layout>
      <div className="register-container">
        <div className="register-box">
          <h1 className="register-title">Crear cuenta</h1>

          {error && <p className="register-error">{error}</p>}

          <form className="register-form" onSubmit={(e) => e.preventDefault()}>
            <label>Nombre de usuario</label>
            <input
              type="text"
              placeholder="Tu usuario"
              className="register-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              className="register-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Contraseña</label>
            <input
              type="password"
              placeholder="********"
              className="register-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="register-button" onClick={handleRegister}>
              Registrarse
            </button>
          </form>

          <p className="register-link-text">
            ¿Ya tenés cuenta?{" "}
            <span className="register-link" onClick={() => navigate("/login")}>
              Iniciá sesión
            </span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
