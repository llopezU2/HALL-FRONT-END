import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig"; // Importa el cliente Axios configurado

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
        contraseña: password, // La API espera "contraseña" en lugar de "password"
      });

      navigate("/login"); // Redirige al login después del registro exitoso
    } catch (err) {
      setError("Error al registrar. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="bg-[#1a1a1a] p-8 rounded-xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          Crear cuenta
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Nombre de usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-600 placeholder-gray-400 text-white"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-600 placeholder-gray-400 text-white"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded bg-gray-800 border border-gray-600 placeholder-gray-400 text-white"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-yellow-400 hover:bg-yellow-500 transition-all text-black font-semibold py-3 rounded shadow-md"
        >
          Registrarse
        </button>

        <p className="text-center mt-6 text-sm text-gray-400">
          ¿Ya tienes una cuenta?
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-400 cursor-pointer ml-1 hover:underline"
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}
