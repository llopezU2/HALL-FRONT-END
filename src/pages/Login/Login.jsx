import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Layout from "../../components/Layout";
import api from "../../api/axiosConfig";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        contraseña: password,
      });

      const { access_token, user } = response.data;

      // 1) Guardar token y user
      localStorage.setItem("token", access_token);
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      localStorage.setItem("user", JSON.stringify(user));

      // 2) Redirigir según rol
      if (user.rol.id_rol === 1) {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Credenciales inválidas. Por favor, inténtalo de nuevo.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Layout>
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">Iniciar sesión</h1>

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
