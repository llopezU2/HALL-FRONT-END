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

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id_usuario;
  const isAdmin = user?.rol?.id_rol === 1;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [pendingSolicitudes, setPendingSolicitudes] = useState(0);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    if (!isAdmin && userId) {
      api
        .get(`/solicitud/received/${userId}`)
        .then((res) => setPendingSolicitudes(res.data.length))
        .catch((err) => console.error(err));
    }
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isSearchOpen, isMobile]);

  // 🔍 Buscar juegos en tiempo real
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        api
          .get(`/juego/buscar?query=${searchTerm}`)
          .then((res) => setSearchResults(res.data))
          .catch(() => setSearchResults([]));
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };
  const toggleSearch = () => {
    setIsSearchOpen((open) => !open);
    setSearchTerm("");
    setSearchResults([]);
  };
  const toggleMenu = () => setIsMenuOpen((open) => !open);

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-left">
          <img src={logo} alt="Logo HALLGRANDE" className="navbar-img" />
          <Link to={isAdmin ? "/admin" : "/home"} className="navbar-name">
            HALL
          </Link>
        </div>

        {/* No admin */}
        {!isAdmin && (
          <>
            {/* Desktop: plataformas y buscador */}
            {!isMobile && (
              <div className="navbar-center">
                <div className="platforms">
                  <Link to="/plataforma/1" className="platform">
                    <i className="fab fa-playstation"></i> PlayStation
                  </Link>
                  <Link to="/plataforma/2" className="platform">
                    <i className="fab fa-xbox"></i> Xbox
                  </Link>
                  <Link to="/plataforma/3" className="platform">
                    <i className="fas fa-gamepad"></i> Nintendo
                  </Link>
                  <Link to="/plataforma/4" className="platform">
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
                  {isSearchOpen && searchResults.length > 0 && (
                    <ul className="search-suggestions">
                      {searchResults.map((j) => (
                        <li
                          key={j.id_juego}
                          className="suggestion-card"
                          onClick={() => {
                            navigate(`/juego/${j.id_juego}`);
                            setSearchTerm("");
                            setSearchResults([]);
                            setIsSearchOpen(false);
                          }}
                        >
                          <img
                            src={
                              j.portada ||
                              "https://via.placeholder.com/80x80?text=No+Img"
                            }
                            alt={j.titulo}
                            className="suggestion-card-img"
                          />
                          <div className="suggestion-card-info">
                            <p className="suggestion-card-title">{j.titulo}</p>
                            <div className="suggestion-card-meta"></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Right panel */}
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

              <button
                className="hallplus-premium-button"
                onClick={() => navigate("/hall-plus")}
              >
                <i className="fas fa-crown"></i>
                <span className="hallplus-text">
                  HALL<span className="hallplus-plus">+</span>
                </span>
              </button>

              {isAuth && (
                <>
                  <div
                    className="navbar-user-dropdown"
                    tabIndex={0}
                    onBlur={() =>
                      setTimeout(() => setIsUserDropdownOpen(false), 150)
                    }
                  >
                    <button
                      className="navbar-link navbar-profile-btn"
                      onClick={() => setIsUserDropdownOpen((open) => !open)}
                    >
                      <img
                        src={
                          user?.foto ||
                          `https://ui-avatars.com/api/?name=${user?.nombre}&background=3b82f6&color=fff`
                        }
                        alt="Perfil"
                        className="navbar-profile-img"
                      />
                      <i className="fas fa-caret-down navbar-caret"></i>
                    </button>
                    {isUserDropdownOpen && (
                      <div className="navbar-dropdown-menu">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          Mi perfil
                        </Link>
                        <Link
                          to="/biblioteca-usuario"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          Ver mi biblioteca
                        </Link>
                        <Link
                          to="/suscrip-usuario"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          Suscripciones
                        </Link>
                      </div>
                    )}
                  </div>

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
                </>
              )}

              {!isMobile && isAuth && (
                <button onClick={handleLogout} className="navbar-button-logout">
                  Cerrar sesión
                </button>
              )}

              {!isAuth && (
                <button
                  className="navbar-button-login"
                  onClick={() => navigate("/login")}
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          </>
        )}
      </nav>

      {/* Buscador móvil */}
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

      {/* Menú hamburguesa móvil */}
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
