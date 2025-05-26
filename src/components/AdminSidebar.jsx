import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <img
          src="/src/img/LogoOficialGrande.png"
          alt="Logo Oficial"
          className="logo-img"
        />
      </div>

      <ul>
        <li>
          <a href="/admin">Panel Admin</a>
        </li>
        <li>
          <a href="/admin/categorias">Ver Categorías</a>
        </li>
        <li>
          <a href="/admin/suscripciones">Ver Suscripciones</a>
        </li>
        <li>
          <a href="/admin/proveedores">Ver Proveedores</a>
        </li>
        <li>
          <a href="/admin/key">Ver Keys</a>
        </li>
        <li>
          <a href="/admin/juegos">Ver Juegos</a>
        </li>
        <li>
          <a href="/profile">
            <FaUser style={{ marginRight: 8 }} />
            Perfil
          </a>
        </li>
        <li>
          <button onClick={handleLogout} className="sidebar-logout">
            <FaSignOutAlt style={{ marginRight: 8 }} />
            Cerrar sesión
          </button>
        </li>
      </ul>
    </aside>
  );
}
