import './Navbar.css';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from "../auth";
import logo from "../img/LogoOficialGrande.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = auth.isAuthenticated();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);

  const isProfileView = location.pathname === "/profile";

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchTerm('');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Detectar cambios de tamaño
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cierre del buscador en escritorio
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSearchOpen &&
        !isMobile &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen, isMobile]);

  return (
    <div className='navbar-wrapper'>

<>
      <nav className="navbar">
        {/* Logo y título */}
        <div className="navbar-left">
          <img src={logo} alt="Logo HALLGRANDE" className="navbar-img" />
          <Link to="/" className="navbar-name">HALL</Link>
        </div>

        {/* Escritorio: plataformas + buscador embebido */}
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
                className={`navbar-search-input ${isSearchOpen ? 'visible' : ''}`}
                placeholder="Buscar juegos, plataformas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Derecha: siempre visible */}
        <div className="navbar-right">
          {/* Lupa móvil */}
          {isMobile && (
            <button className="search-toggle" onClick={toggleSearch}>
              <i className="fas fa-search"></i>
            </button>
          )}

          {/* Menú hamburguesa móvil */}
          {isMobile && (
            <button className="menu-toggle" onClick={toggleMenu}>
              <i className="fas fa-bars"></i>
            </button>

          )}

          {/* Ícono de perfil solo en /profile */}
          {isProfileView && (
            <Link to="/profile" className="navbar-link">
              <i className="fas fa-user-circle"></i>
            </Link>
          )}

          {/* Escritorio: cerrar sesión solo en profile */}
          {!isMobile && isProfileView && isAuth && (
            <button onClick={handleLogout} className="navbar-button-logout">
              Cerrar sesión
            </button>
          )}


        </div>
      </nav>

      {/* Modal buscador móvil */}
      {isSearchOpen && isMobile && (
        <div className="search-modal" onClick={() => setIsSearchOpen(false)}>
          <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="search-close" onClick={() => setIsSearchOpen(false)}>
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
      {isMobile && isMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-menu-list">
            <li>
              <Link to="/plataforma/playstation" className="platform" onClick={() => setIsMenuOpen(false)}>
                <i className="fab fa-playstation"></i> PlayStation
              </Link>
            </li>
            <li>
              <Link to="/plataforma/xbox" className="platform" onClick={() => setIsMenuOpen(false)}>
                <i className="fab fa-xbox"></i> Xbox
              </Link>
            </li>
            <li>
              <Link to="/plataforma/nintendo" className="platform" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-gamepad"></i> Nintendo
              </Link>
            </li>
            <li>
              <Link to="/plataforma/pc" className="platform" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-desktop"></i> PC
              </Link>
            </li>
            {isProfileView && (
              <li>
                <button className="logout-button" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Cerrar sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      )}

    </>

    </div>
  );
}
