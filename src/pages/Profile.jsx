import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth";

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-[#1a1a1a] p-8 rounded-xl shadow-xl text-white">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Perfil del Usuario</h2>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-800 p-4 rounded">
            <p className="text-gray-400 text-sm">Nombre de usuario</p>
            <p className="text-lg font-semibold">usuario_demo</p>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <p className="text-gray-400 text-sm">Correo electrónico</p>
            <p className="text-lg font-semibold">correo@demo.com</p>
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
