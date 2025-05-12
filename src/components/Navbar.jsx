import "./Navbar.css";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../auth";
import logo from "../img/LogoOficialGrande.png";
import api from "../api/axiosConfig";
import { FaBars } from "react-icons/fa";

export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = auth.isAuthenticated();

  // 1) Obtén el usuario de localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id_usuario;

  // 2) Detecta si es admin
  const isAdmin = user?.rol?.id_rol === 1;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const [pendingSolicitudes, setPendingSolicitudes] = useState(0);

  // Fetch solicitudes pendientes (solo para no-admin)
  useEffect(() => {
    if (!isAdmin && userId) {
      api
        .get(`/solicitud/received/${userId}`)
        .then((res) => setPendingSolicitudes(res.data.length))
        .catch((err) => console.error(err));
    }
  }, [location.pathname]);

  // Resize handler
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Click fuera de buscador
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        isSearchOpen &&
        !isMobile &&
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isSearchOpen, isMobile]);

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };
  const toggleSearch = () => {
    setIsSearchOpen((open) => !open);
    setSearchTerm("");
  };
  const toggleMenu = () => {
    setIsMenuOpen((open) => !open);
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        {/* LOGO siempre visible */}
        <div className="navbar-left">
          <img src={logo} alt="Logo HALLGRANDE" className="navbar-img" />
          <Link to={isAdmin ? "/admin" : "/home"} className="navbar-name">
            HALL
          </Link>
        </div>

        {/* Todo lo demás SOLO si NO es admin */}
        {!isAdmin && (
          <>
            {/* Centros de links y buscador (desktop) */}
            {!isMobile && (
              <div className="navbar-center">
                <div className="platforms">
                  <Link to="/plataforma/playstation" className="platform">
                    <i className="fab fa-playstation"></i> PlayStation
                  </Link>
                  <Link to="/plataforma/xbox" className="platform">
                    <i className="fab fa-xbox"></i> Xbox
                  </Link>
                  <Link to="/plataforma/nintendo" className="platform">
                    <i className="fas fa-gamepad"></i> Nintendo
                  </Link>
                  <Link to="/plataforma/pc" className="platform">
                    <i className="fas fa-desktop"></i> PC
                  </Link>
                </div>
                <div className="search-wrapper" ref={searchRef}>
                  <button className="search-toggle" onClick={toggleSearch}>
                    {isSearchOpen ? (
                      <i className="fas fa-times"></i>
                    ) : (
                      <i className="fas fa-search"></i>
                    )}
                  </button>
                  <input
                    type="text"
                    className={`navbar-search-input ${
                      isSearchOpen ? "visible" : ""
                    }`}
                    placeholder="Buscar juegos, plataformas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Lado derecho */}
            <div className="navbar-right">
              {isMobile &&
                (onToggleSidebar ? (
                  <button
                    className="menu-toggle-float"
                    onClick={onToggleSidebar}
                  >
                    <FaBars />
                  </button>
                ) : (
                  <button className="menu-toggle" onClick={toggleMenu}>
                    <FaBars />
                  </button>
                ))}

              {isAuth && (
                <Link to="/profile" className="navbar-link">
                  <img
                    src={
                      user?.foto ||
                      `https://ui-avatars.com/api/?name=${user?.nombre}&background=3b82f6&color=fff`
                    }
                    alt="Perfil"
                    className="navbar-profile-img"
                  />
                </Link>
              )}

              {isAuth && (
                <Link
                  to="/solicitudes"
                  className="navbar-link solicitudes-icon-wrapper"
                >
                  <i className="fas fa-user-friends"></i>
                  {pendingSolicitudes > 0 && (
                    <span className="solicitudes-badge">
                      {pendingSolicitudes}
                    </span>
                  )}
                </Link>
              )}

              {!isMobile && isAuth && (
                <button onClick={handleLogout} className="navbar-button-logout">
                  Cerrar sesión
                </button>
              )}
            </div>
          </>
        )}
      </nav>

      {/* buscador móvil */}
      {!isAdmin && isSearchOpen && isMobile && (
        <div className="search-modal" onClick={() => setIsSearchOpen(false)}>
          <div
            className="search-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="search-close"
              onClick={() => setIsSearchOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <input
              type="text"
              className="search-modal-input"
              placeholder="Buscar juegos, plataformas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}

      {/* menú hamburguesa móvil */}
      {!isAdmin && isMobile && isMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-menu-list">
            <li>
              <Link
                to="/plataforma/playstation"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fab fa-playstation"></i> PlayStation
              </Link>
            </li>
            <li>
              <Link to="/plataforma/xbox" onClick={() => setIsMenuOpen(false)}>
                <i className="fab fa-xbox"></i> Xbox
              </Link>
            </li>
            <li>
              <Link
                to="/plataforma/nintendo"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-gamepad"></i> Nintendo
              </Link>
            </li>
            <li>
              <Link to="/plataforma/pc" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-desktop"></i> PC
              </Link>
            </li>
            <li>
              <button className="logout-button" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
