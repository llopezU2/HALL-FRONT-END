import { Link, useNavigate } from "react-router-dom";
import { auth } from "../auth";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuth = auth.isAuthenticated();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#111] text-white px-6 py-4 shadow-md flex items-center justify-between">
      <div className="text-yellow-400 font-bold text-xl">
        <Link to="/">HALL</Link>
      </div>
      <div className="space-x-4">
        {!isAuth ? (
          <>
            <Link to="/login" className="hover:text-yellow-400">
              Iniciar sesión
            </Link>
            <Link to="/register" className="hover:text-yellow-400">
              Registro
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="hover:text-yellow-400">
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
