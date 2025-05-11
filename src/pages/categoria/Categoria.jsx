import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import "./Categoria.css";

export default function Categoria() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false); // para mantenerlo visible mientras se anima


  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
const toggleFabMenu = () => {
  if (fabMenuOpen) {
    // iniciar fade-out y luego ocultar
    setFabMenuOpen(false);
    setTimeout(() => setShowFabMenu(false), 250); // tiempo de animación
  } else {
    setShowFabMenu(true);     // mostrar el menú
    setTimeout(() => setFabMenuOpen(true), 10); // pequeño delay para que tome el fade-in
  }
};

  return (
    <div className="categoria-wrapper">
      <Navbar />

      <div className="categoria-content">
        {sidebarOpen && (
          <aside className="categoria-sidebar">
            <h3>Sección Categorías</h3>
            <ul>
              <li><a href="/admin/suscripciones">Ver Suscripciones</a></li>
              <li><a href="/admin">Volver al Panel</a></li>
            </ul>
          </aside>
        )}

        <main className={`categoria-panel ${!sidebarOpen ? "no-sidebar" : ""}`}>
          <h1>Gestión de Categorías</h1>
          {/* Aquí puedes poner los formularios o contenido relacionado */}
        </main>
      </div>

      {isMobile && (
  <>
    <button className="categoria-fab-toggle" onClick={toggleFabMenu}>
      <FaBars />
    </button>

    {showFabMenu && (
      <div className={`categoria-fab-menu-container ${fabMenuOpen ? "fade-in" : "fade-out"}`}>
        <a href="/admin/suscripciones" className="categoria-fab-link">Ver Suscripciones</a>
        <a href="/admin" className="categoria-fab-link">Volver al Panel</a>
      </div>
    )}
  </>
)}



    </div>
  );
}
