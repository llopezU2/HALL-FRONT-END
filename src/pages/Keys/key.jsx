import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import "./key.css";

const KeyManager = () => {
  // Estados para formulario
  const [providers, setProviders] = useState([]);
  const [games, setGames] = useState([]);
  const [form, setForm] = useState({
    provider: "",
    game: "",
    quantity: "",
    buyPrice: "",
    sellPrice: "",
    key: "",
  });

  // Estados para visualización y filtros
  const [keys, setKeys] = useState([]);
  const [filters, setFilters] = useState({
    platform: "",
    game: "",
    price: "",
  });

  // Sidebar responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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

  // Cargar proveedores y juegos (simulado, reemplaza con tu API)
  useEffect(() => {
    setProviders(["Steam", "Epic", "Origin"]);
    setGames([
      { id: 1, name: "FIFA 24", platform: "Origin" },
      { id: 2, name: "GTA V", platform: "Steam" },
      { id: 3, name: "Fortnite", platform: "Epic" },
    ]);
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    setKeys([
      { id: 1, provider: "Steam", game: "GTA V", platform: "Steam", price: 20, sellPrice: 30, quantity: 5, key: "STEAM-123-456" },
      { id: 2, provider: "Epic", game: "Fortnite", platform: "Epic", price: 0, sellPrice: 10, quantity: 10, key: "EPIC-ABC-789" },
    ]);
  };

  // Manejo de formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (
      !form.provider ||
      !form.game ||
      !form.quantity ||
      !form.buyPrice ||
      !form.sellPrice ||
      !form.key
    ) {
      alert("Todos los campos son obligatorios.");
      return false;
    }
    if (
      Number(form.quantity) < 1 ||
      Number(form.buyPrice) < 0 ||
      Number(form.sellPrice) < 0
    ) {
      alert("No se permiten valores negativos ni cantidades menores a 1.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Aquí deberías hacer el POST a tu API
    // await api.post("/keys", form);
    fetchKeys();
    setForm({ provider: "", game: "", quantity: "", buyPrice: "", sellPrice: "", key: "" });
  };

  // Filtros
  const filteredKeys = keys.filter((k) => {
    return (
      (!filters.platform || k.platform === filters.platform) &&
      (!filters.game || k.game === filters.game) &&
      (!filters.price || k.sellPrice >= Number(filters.price))
    );
  });

  // Sidebar mobile toggle
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleFabMenu = () => {
    if (fabMenuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setFabMenuOpen(false);
        setIsClosing(false);
      }, 250);
    } else {
      setFabMenuOpen(true);
    }
  };

  return (
    <div className="key-wrapper">
      <div className="key-content">
        {sidebarOpen && (
          <aside className="key-sidebar">
            <div className="key-sidebar-logo">
              <img
                src="../src/img/LogoOficialGrande.png"
                alt="Logo Oficial"
                className="logo-img"
              />
            </div>
            <h3>Panel Admin</h3>
            <ul>
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
                <a class="nav-link active" href="/admin/key">Ver Keys</a>
              </li>
              <li>
                <a href="/admin">Volver al Panel</a>
              </li>
            </ul>
          </aside>
        )}

        <main className={`key-panel ${!sidebarOpen ? "no-sidebar" : ""}`}>
          <h1>Gestión de Keys</h1>
          <div className="key-form-filters-row">
            <div className="key-form-section">
              <h2>Agregar nueva Key</h2>
              <form onSubmit={handleSubmit}>
                <select name="provider" value={form.provider} onChange={handleChange} required>
                  <option value="">Proveedor</option>
                  {providers.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
                <select name="game" value={form.game} onChange={handleChange} required>
                  <option value="">Juego</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.name}>{g.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Cantidad"
                  value={form.quantity}
                  onChange={handleChange}
                  min={1}
                  required
                />
                <input
                  type="number"
                  name="buyPrice"
                  placeholder="Precio de compra"
                  value={form.buyPrice}
                  onChange={handleChange}
                  min={0}
                  step="0.01"
                  required
                />
                <input
                  type="number"
                  name="sellPrice"
                  placeholder="Precio de venta"
                  value={form.sellPrice}
                  onChange={handleChange}
                  min={0}
                  step="0.01"
                  required
                />
                <input
                  type="text"
                  name="key"
                  placeholder="Clave/Key"
                  value={form.key}
                  onChange={handleChange}
                  required
                />
              </form>
              {/* Botón fuera del formulario */}
              <button
                type="button"
                className="key-add-btn"
                onClick={handleSubmit}
              >
                Agregar Key
              </button>
            </div>
            <div className="key-filters key-filters-side">
              <select
                value={filters.platform}
                onChange={e => setFilters({ ...filters, platform: e.target.value })}
              >
                <option value="">Plataforma</option>
                {[...new Set(games.map(g => g.platform))].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                value={filters.game}
                onChange={e => setFilters({ ...filters, game: e.target.value })}
              >
                <option value="">Juego</option>
                {games.map(g => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Precio mínimo"
                value={filters.price}
                onChange={e => setFilters({ ...filters, price: e.target.value })}
                min={0}
              />
            </div>
          </div>
          <div className="key-list">
            <table>
              <thead>
                <tr>
                  <th>Proveedor</th>
                  <th>Juego</th>
                  <th>Plataforma</th>
                  <th>Cantidad</th>
                  <th>Precio Compra</th>
                  <th>Precio Venta</th>
                  <th>Key</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeys.map((k) => (
                  <tr key={k.id}>
                    <td>{k.provider}</td>
                    <td>{k.game}</td>
                    <td>{k.platform}</td>
                    <td>{k.quantity}</td>
                    <td>${k.price}</td>
                    <td>${k.sellPrice}</td>
                    <td>{k.key}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Botón flotante solo para móvil */}
      {isMobile && (
        <div className="key-floating-button-container">
          {(fabMenuOpen || isClosing) && (
            <div className={`key-fab-menu ${isClosing ? "fade-out" : "fade-in"}`}>
              <a href="/admin/categorias" className="key-fab-link">
                Ver Categorías
              </a>
              <a href="/admin/suscripciones" className="key-fab-link">
                Ver Suscripciones
              </a>
              <a href="/admin/suscripciones" className="key-fab-link">
                Ver Proveedores
              </a>
              <a href="/admin/key" className="key-fab-link">
                Ver Keys
              </a>
            </div>
          )}
          <button className="key-fab-toggle" onClick={toggleFabMenu}>
            <FaBars />
          </button>
        </div>
      )}
    </div>
  );
};

export default KeyManager;