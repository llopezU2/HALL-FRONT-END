import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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

  // Detecta si el usuario está usando el código admin
  const isAdminCode = password === "ADMIN123";

  const handlePasswordChange = (value) => {
    setPassword(value);

    // Solo validar requisitos cuando NO sea el código de admin
    if (value !== "ADMIN123") {
      setPasswordRequirements({
        length: value.length >= 8,
        lowercase: /[a-z]/.test(value),
        uppercase: /[A-Z]/.test(value),
        number: /\d/.test(value),
        special: /[\W_]/.test(value),
      });
    }
  };

  const handleRegister = async () => {
    // Reset error
    setError("");

    // Validaciones básicas de nombre y email
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usernameRegex.test(nombre)) {
      setError(
        "El nombre solo puede contener letras y números, sin espacios ni símbolos."
      );
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Correo electrónico inválido.");
      return;
    }

    // Si no es código admin, chequea requisitos de contraseña
    const passwordValid =
      isAdminCode || Object.values(passwordRequirements).every(Boolean);
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

      // SweetAlert de éxito
      await Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: isAdminCode
          ? "Has creado una cuenta de administrador exitosamente"
          : "Te has registrado correctamente",
        confirmButtonText: "OK",
      });

      navigate("/login");
    } catch (err) {
      setError("Error al registrar. Por favor, inténtalo de nuevo.");
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

            {/* Si es el código admin, mostramos mensaje especial */}
            {isAdminCode ? (
              <p className="special-admin-msg">
                🔐 Estás creando una cuenta <strong>ADMINISTRADOR</strong>
              </p>
            ) : (
              // Si no, mostramos los requisitos habituales
              password && (
                <>
                  <div className="password-requirements">
                    <p
                      className={
                        passwordRequirements.length ? "valid" : "invalid"
                      }
                    >
                      {passwordRequirements.length ? "✅" : "❌"} Al menos 8
                      caracteres
                    </p>
                    <p
                      className={
                        passwordRequirements.lowercase ? "valid" : "invalid"
                      }
                    >
                      {passwordRequirements.lowercase ? "✅" : "❌"} Una letra
                      minúscula
                    </p>
                    <p
                      className={
                        passwordRequirements.uppercase ? "valid" : "invalid"
                      }
                    >
                      {passwordRequirements.uppercase ? "✅" : "❌"} Una letra
                      mayúscula
                    </p>
                    <p
                      className={
                        passwordRequirements.number ? "valid" : "invalid"
                      }
                    >
                      {passwordRequirements.number ? "✅" : "❌"} Un número
                    </p>
                    <p
                      className={
                        passwordRequirements.special ? "valid" : "invalid"
                      }
                    >
                      {passwordRequirements.special ? "✅" : "❌"} Un símbolo
                      (!@#$%)
                    </p>
                  </div>
                  <div className="password-strength-bar">
                    <div
                      className="password-strength-fill"
                      style={{
                        width: `${
                          Object.values(passwordRequirements).filter(Boolean)
                            .length * 20
                        }%`,
                      }}
                    />
                  </div>
                </>
              )
            )}

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
