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
      // 1) Intentamos iniciar sesión
      const response = await api.post("/auth/login", {
        email,
        contraseña: password,
      });

      // 2) Guardamos el token y preparamos el header
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      // 3) Recuperamos el perfil (incluye role y roleId)
      const profile = await api.get("/auth/profile");
      const userData = profile.data; // { sub, email, role, roleId, ... }

      // 4) Guardamos el usuario en localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // 5) Redirigimos según el rol
      if (userData.roleId === 1 || userData.role === "admin") {
        navigate("/admin"); // ruta de tu panel de admin
      } else {
        navigate("/home"); // ruta de usuarios normales
      }
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
