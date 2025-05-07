import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axiosConfig";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        contraseña: password,
      });

      const { access_token } = response.data;
      // 1) Guardamos el token
      localStorage.setItem("token", access_token);
      // 2) Inyectamos el header para las siguientes peticiones
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      // 3) Recuperamos el profile para extraer el userId
      const profile = await api.get("/auth/profile");
      localStorage.setItem("user", JSON.stringify(profile.data));

      navigate("/home");
    } catch (err) {
      setError("Credenciales inválidas. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <Layout>
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">Iniciar sesión</h1>

          {error && <p className="login-error">{error}</p>}

          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <label>Correo electrónico</label>
            <input
              type="email"
              className="login-input"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Contraseña</label>
            <input
              type="password"
              className="login-input"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="login-button" onClick={handleLogin}>
              Entrar
            </button>
          </form>

          <p className="login-link-text">
            ¿No tenés cuenta?{" "}
            <span className="login-link" onClick={() => navigate("/register")}>
              Registrate
            </span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
