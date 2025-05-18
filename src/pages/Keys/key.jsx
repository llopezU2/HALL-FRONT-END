import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import "./key.css";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";

const KeyManager = () => {
  // Estados para el formulario de agregar nueva key
  const [providers, setProviders] = useState([]); // Lista de proveedores
  const [games, setGames] = useState([]); // Lista de juegos
  const [platforms, setPlatforms] = useState([]); // Lista de plataformas
  const [form, setForm] = useState({
    provider: "", // ID del proveedor seleccionado
    game: "", // ID del juego seleccionado
    platform: "", // ID de la plataforma seleccionada
    quantity: "", // Cantidad de keys a agregar
    buyPrice: "", // Precio de compra
    sellPrice: "", // Precio de venta
  });

  // Estados para la visualización y filtros de la tabla de keys
  const [keys, setKeys] = useState([]); // Lista de keys mostradas en la tabla
  const [filters, setFilters] = useState({
    platform: "", // Plataforma seleccionada para filtrar
    game: "", // Juego seleccionado para filtrar
    price: "", // Precio mínimo para filtrar
  });

  // Estados para el manejo de la interfaz responsiva y sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Si es vista móvil
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Estado del sidebar
  const [fabMenuOpen, setFabMenuOpen] = useState(false); // Menú flotante móvil
  const [isClosing, setIsClosing] = useState(false); // Animación de cierre del menú flotante

  // Nuevos estados para el conteo de keys por juego
  const [gameCounts, setGameCounts] = useState([]); // Conteo de keys por juego
  const [selectedGameCount, setSelectedGameCount] = useState(null); // Conteo para el juego filtrado

  // Efecto para manejar el cambio de tamaño de la ventana y actualizar la vista móvil/sidebar
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

  // Efecto para cargar proveedores, juegos y plataformas al iniciar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carga los datos de juegos, plataformas y proveedores desde la API
        const [gamesRes, platformsRes, providersRes] = await Promise.all([
          api.get("/juego"),
          api.get("/plataforma"),
          api.get("/proveedores"),
        ]);
        // Mapea y guarda los proveedores
        setProviders(
          providersRes.data.map((p) => ({
            ...p,
            id: p.id_proveedor,
            name: p.nombre,
          }))
        );
        // Mapea y guarda los juegos
        setGames(
          gamesRes.data.map((j) => ({
            ...j,
            id: j.id_juego,
            name: j.titulo,
            platform: j.plataforma,
          }))
        );
        // Guarda las plataformas
        setPlatforms(platformsRes.data);
        // Carga las keys existentes
        fetchKeys();
      } catch (error) {
        alert("Error al cargar datos iniciales");
        setGames([]);
        setPlatforms([]);
        setProviders([]);
      }
    };
    fetchData();
  }, []);

  // Efecto para cargar el conteo de keys por juego
  useEffect(() => {
    const fetchGameCounts = async () => {
      try {
        const res = await api.get("/key/counts/juego");
        setGameCounts(res.data);
      } catch (error) {
        setGameCounts([]);
      }
    };
    fetchGameCounts();
  }, []);

  // Función para cargar las keys desde la API y formatearlas para la tabla
  const fetchKeys = async () => {
    try {
      const res = await api.get("/key");
      setKeys(
        res.data.map((k) => ({
          id: k.id_key,
          provider: k.proveedor?.nombre || "",
          game: k.juego?.titulo || "",
          platform: k.plataforma?.nombre || "",
          price: k.precio_compra,
          sellPrice: k.precio_venta,
          quantity: 1,
          key: k.key,
        }))
      );
    } catch (error) {
      alert("Error al cargar las keys");
      setKeys([]);
    }
  };

  // Maneja los cambios en los campos del formulario de agregar key
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Valida que todos los campos del formulario sean válidos antes de enviar
  const validateForm = () => {
    if (
      !form.provider ||
      !form.game ||
      !form.platform ||
      isNaN(Number(form.platform)) ||
      !form.quantity ||
      !form.buyPrice ||
      !form.sellPrice
    ) {
      alert("Todos los campos son obligatorios y válidos.");
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
    if (!form.platform || isNaN(Number(form.platform))) {
      alert("Selecciona una plataforma válida.");
      return false;
    }
    return true;
  };

  // Maneja el envío del formulario para agregar una nueva key
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const providerObj = providers.find((p) => p.id === Number(form.provider));
    const gameObj = games.find((g) => g.id === Number(form.game));
    if (!providerObj || !gameObj) {
      alert("Proveedor o juego inválido.");
      return;
    }

    try {
      const payload = {
        proveedorId: providerObj.id,
        juegoId: gameObj.id,
        plataformaId: Number(form.platform),
        cantidad: Number(form.quantity),
        precioCompra: Number(form.buyPrice),
        precioVenta: Number(form.sellPrice),
        descripcion: "",
      };
      console.log("Payload enviado a /transaccion/compra:", payload);
      await api.post("/transaccion/compra", payload);
      Swal.fire({
        icon: "success",
        title: "¡Key agregada!",
        text: "La compra se registró correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchKeys();
      setForm({
        provider: "",
        game: "",
        platform: "",
        quantity: "",
        buyPrice: "",
        sellPrice: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar la compra",
      });
    }
  };

  // Filtra las keys según los filtros seleccionados (plataforma, juego, precio mínimo)
  const filteredKeys = keys.filter((k) => {
    const priceFilter = filters.price !== "" ? Number(filters.price) : null;
    return (
      (!filters.platform || k.platform === filters.platform) &&
      (!filters.game || k.game === filters.game) &&
      (priceFilter === null || k.sellPrice >= priceFilter)
    );
  });

  // Llama al endpoint del backend para filtrar keys por precio mínimo
  const handlePriceFilter = async () => {
    if (filters.price === "" || isNaN(Number(filters.price))) {
      fetchKeys();
      return;
    }
    try {
      const res = await api.post("/key/filtrar-precio", {
        precio: Number(filters.price),
      });
      setKeys(
        res.data.map((k) => ({
          id: k.id_key,
          provider: k.proveedor?.nombre || "",
          game: k.juego?.titulo || "",
          platform: k.plataforma?.nombre || "",
          price: k.precio_compra,
          sellPrice: k.precio_venta,
          quantity: 1,
          key: k.key,
        }))
      );
    } catch (error) {
      alert("Error al filtrar por precio");
    }
  };

  // Alterna la visibilidad del sidebar en escritorio
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Alterna el menú flotante en móvil (con animación)
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

  // Efecto para actualizar el conteo de keys del juego seleccionado
  useEffect(() => {
    if (!filters.game) {
      setSelectedGameCount(null);
      return;
    }
    // Encuentra el ID del juego seleccionado a partir del nombre
    const selectedGameObj = games.find((g) => g.name === filters.game);
    const selectedGameId = selectedGameObj ? selectedGameObj.id : null;

    // Busca el conteo usando el ID
    const found = gameCounts.find(
      (g) => String(g.id_juego) === String(selectedGameId)
    );
    const selectedGameCount = found ? found.cantidad : 0;
    setSelectedGameCount(selectedGameCount);
  }, [filters.game, gameCounts]);

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
                <a className="nav-link active" href="/admin/key">
                  Ver Keys
                </a>
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
            {/* Sección para agregar una nueva key */}
            <div className="key-form-section">
              <h2>Agregar nueva Key</h2>
              <form onSubmit={handleSubmit}>
                <select
                  name="provider"
                  value={form.provider}
                  onChange={handleChange}
                  required
                >
                  <option value="">Proveedor</option>
                  {providers.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.nombre}
                    </option>
                  ))}
                </select>
                <select
                  name="game"
                  value={form.game}
                  onChange={handleChange}
                  required
                >
                  <option value="">Juego</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
                <select
                  name="platform"
                  value={form.platform}
                  onChange={handleChange}
                  required
                >
                  <option value="">Plataforma</option>
                  {platforms.map((p) => (
                    <option key={p.id_plataforma} value={p.id_plataforma}>
                      {p.nombre}
                    </option>
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
                <button type="submit" className="key-add-btn">
                  Agregar Key
                </button>
              </form>
            </div>
            {/* Sección de filtros para la tabla de keys */}
            <div className="key-filters key-filters-side">
              <select
                value={filters.platform}
                onChange={(e) =>
                  setFilters({ ...filters, platform: e.target.value })
                }
              >
                <option value="">Plataforma</option>
                {platforms.map((p) => (
                  <option key={p.id} value={p.nombre}>
                    {p.nombre}
                  </option>
                ))}
              </select>
              <select
                value={filters.game}
                onChange={(e) =>
                  setFilters({ ...filters, game: e.target.value })
                }
              >
                <option value="">Juego</option>
                {games.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Precio mínimo"
                value={filters.price}
                onChange={(e) =>
                  setFilters({ ...filters, price: e.target.value })
                }
                onBlur={handlePriceFilter}
                min={0}
              />
            </div>
          </div>
          {filters.game && (
            <div
              style={{ margin: "16px 0", fontWeight: "bold", color: "#00bfff" }}
            >
              Total de keys para el juego seleccionado: {selectedGameCount || 0}
            </div>
          )}
          {/* Tabla de keys (sin mostrar la key ni la cantidad) */}
          <div className="key-list">
            <table>
              <thead>
                <tr>
                  <th>Proveedor</th>
                  <th>Juego</th>
                  <th>Plataforma</th>
                  <th>Precio Compra</th>
                  <th>Precio Venta</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeys.map((k) => (
                  <tr key={k.id}>
                    <td>{k.provider}</td>
                    <td>{k.game}</td>
                    <td>{k.platform}</td>
                    <td>${k.price}</td>
                    <td>${k.sellPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Botón flotante y menú para navegación rápida en móvil */}
      {isMobile && (
        <div className="key-floating-button-container">
          {(fabMenuOpen || isClosing) && (
            <div
              className={`key-fab-menu ${isClosing ? "fade-out" : "fade-in"}`}
            >
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
