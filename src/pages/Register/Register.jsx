import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axiosConfig";

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const handlePasswordChange = (value) => {
    setPassword(value);

    setPasswordRequirements({
      length: value.length >= 8,
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /\d/.test(value),
      special: /[\W_]/.test(value),
    });
  };

  const handleRegister = async () => {
    // Validaciones
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordValid = Object.values(passwordRequirements).every(Boolean);

    if (!usernameRegex.test(nombre)) {
      setError("El nombre solo puede contener letras y números, sin espacios ni símbolos.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Correo electrónico inválido.");
      return;
    }

    if (!passwordValid) {
      setError("La contraseña no cumple con los requisitos de seguridad.");
      return;
    }

    try {
      await api.post("/auth/register", {
        nombre,
        email,
        contraseña: password,
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
              onChange={(e) => handlePasswordChange(e.target.value)}
            />

            {/* Requisitos en tiempo real */}
            {password && (
              <div className="password-requirements">
                <p className={passwordRequirements.length ? "valid" : "invalid"}>
                  {passwordRequirements.length ? "✅" : "❌"} Al menos 8 caracteres
                </p>
                <p className={passwordRequirements.lowercase ? "valid" : "invalid"}>
                  {passwordRequirements.lowercase ? "✅" : "❌"} Una letra minúscula
                </p>
                <p className={passwordRequirements.uppercase ? "valid" : "invalid"}>
                  {passwordRequirements.uppercase ? "✅" : "❌"} Una letra mayúscula
                </p>
                <p className={passwordRequirements.number ? "valid" : "invalid"}>
                  {passwordRequirements.number ? "✅" : "❌"} Un número
                </p>
                <p className={passwordRequirements.special ? "valid" : "invalid"}>
                  {passwordRequirements.special ? "✅" : "❌"} Un símbolo (!@#$%)
                </p>
              </div>
            )}
            {/* Barra de seguridad de la contraseña */}
            <div className="password-strength-bar">
              <div
                className="password-strength-fill"
                style={{
                  width: `${Object.values(passwordRequirements).filter(Boolean).length * 20}%`,
                }}
              ></div>
            </div>


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
