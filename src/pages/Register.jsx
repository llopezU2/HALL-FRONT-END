import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = () => {
    // simulación de registro
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="bg-[#1a1a1a] p-8 rounded-xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">Crear cuenta</h2>

        <input
          type="text"
          placeholder="Nombre de usuario"
          className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-600 placeholder-gray-400 text-white"
        />
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
