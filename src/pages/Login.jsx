import { useNavigate } from "react-router-dom";
import { auth } from "../auth";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    auth.login("fake-token");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="bg-[#1a1a1a] p-8 rounded-xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">Iniciar sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-600 placeholder-gray-400 text-white"
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 mb-6 rounded bg-gray-800 border border-gray-600 placeholder-gray-400 text-white"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-yellow-400 hover:bg-yellow-500 transition-all text-black font-semibold py-3 rounded shadow-md"
        >
          Entrar
        </button>

        <p className="text-center mt-6 text-sm text-gray-400">
          ¿No tienes cuenta?
          <span
            onClick={() => navigate("/register")}
            className="text-yellow-400 cursor-pointer ml-1 hover:underline"
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}
