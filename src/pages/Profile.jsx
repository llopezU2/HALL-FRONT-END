import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig"; // Importa el cliente Axios configurado
import Layout from "../components/Layout";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Redirige al login si no hay token
          return;
        }

        const response = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Envía el token en el encabezado
          },
        });

        setUser(response.data); // Guarda los datos del usuario en el estado
      } catch (err) {
        setError(
          "Error al cargar el perfil. Por favor, inicia sesión nuevamente."
        );
        localStorage.removeItem("token"); // Limpia el token si hay un error
        navigate("/login"); // Redirige al login
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token al cerrar sesión
    navigate("/login");
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-[#1a1a1a] p-8 rounded-xl shadow-xl text-white">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Perfil del Usuario
        </h2>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-800 p-4 rounded">
            <p className="text-gray-400 text-sm">Nombre de usuario</p>
            <p className="text-lg font-semibold">{user.nombre}</p>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <p className="text-gray-400 text-sm">Correo electrónico</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 transition-all text-white font-semibold py-3 rounded shadow-md"
        >
          Cerrar sesión
        </button>
      </div>
    </Layout>
  );
}
