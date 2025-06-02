import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaBars } from "react-icons/fa";
import "./key.css";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/AdminSidebar";

const KeyManager = () => {
  // Estados para el formulario
  const [form, setForm] = useState({
    provider: "",
    game: "",
    platform: "",
    quantity: "",
    buyPrice: "",
    sellPrice: "",
  });

  // Estados para datos
  const [providers, setProviders] = useState([]);
  const [games, setGames] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [keys, setKeys] = useState([]);
  const [gameCounts, setGameCounts] = useState([]);

  // Estados para UI
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Estados para filtros y paginación
  const [filters, setFilters] = useState({
    platform: "",
    game: "",
    price: "",
    estado: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  // Carga inicial optimizada
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [platformsRes, keysRes] = await Promise.all([
        api.get("/plataforma"),
        api.get(`/key/estado/1?skip=0&take=${pagination.pageSize}`),
      ]);

      setPlatforms(platformsRes.data);
      setKeys(keysRes.data);

      if (keysRes.headers["x-total-count"]) {
        setPagination((prev) => ({
          ...prev,
          total: parseInt(keysRes.headers["x-total-count"]),
        }));
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos iniciales",
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  // Carga diferida de juegos y proveedores
  const loadGames = useCallback(async () => {
    if (games.length > 0) return;
    try {
      const res = await api.get("/juego");
      setGames(res.data);
    } catch (error) {
      console.error("Error loading games:", error);
    }
  }, [games.length]);

  const loadProviders = useCallback(async () => {
    if (providers.length > 0) return;
    try {
      const res = await api.get("/proveedores");
      setProviders(res.data);
    } catch (error) {
      console.error("Error loading providers:", error);
    }
  }, [providers.length]);

  // Carga de keys con filtros
  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      const estadoId = filters.estado === "vendida" ? 2 : null;

      const skip = (pagination.page - 1) * pagination.pageSize;
      const res = estadoId
        ? await api.get(
            `/key/estado/${estadoId}?skip=${skip}&take=${pagination.pageSize}`
          )
        : await api.get(`/key?skip=${skip}&take=${pagination.pageSize}`);

      setKeys(res.data);

      if (res.headers["x-total-count"]) {
        setPagination((prev) => ({
          ...prev,
          total: parseInt(res.headers["x-total-count"]),
        }));
      }
    } catch (error) {
      console.error("Error loading keys:", error);
    } finally {
      setLoading(false);
    }
  }, [filters.estado, pagination.page, pagination.pageSize]);

  // Efectos
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    fetchInitialData();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [fetchInitialData]);

  useEffect(() => {
    const fetchGameCounts = async () => {
      try {
        const res = await api.get("/key/counts/juego");
        setGameCounts(res.data);
      } catch (error) {
        console.error("Error loading game counts:", error);
      }
    };
    fetchGameCounts();
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  // Handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.provider ||
      !form.game ||
      !form.platform ||
      !form.quantity ||
      !form.buyPrice ||
      !form.sellPrice
    ) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    try {
      const payload = {
        proveedorId: Number(form.provider),
        juegoId: Number(form.game),
        plataformaId: Number(form.platform),
        cantidad: Number(form.quantity),
        precioCompra: Number(form.buyPrice),
        precioVenta: Number(form.sellPrice),
        descripcion: "",
      };

      await api.post("/transaccion/compra", payload);

      Swal.fire({
        icon: "success",
        title: "¡Key agregada!",
        text: "La compra se registró correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      setForm({
        provider: "",
        game: "",
        platform: "",
        quantity: "",
        buyPrice: "",
        sellPrice: "",
      });

      fetchKeys();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al registrar la compra",
      });
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // UI Helpers
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

  // Datos calculados
  const selectedGameCount = useMemo(() => {
    if (!filters.game) return null;
    const game = games.find((g) => g.titulo === filters.game);
    if (!game) return null;
    return gameCounts.find((g) => g.id_juego === game.id_juego)?.cantidad || 0;
  }, [filters.game, games, gameCounts]);

  const filteredKeys = useMemo(() => {
    return keys.filter((key) => {
      const matchesPlatform =
        !filters.platform || key.plataforma?.nombre === filters.platform;
      const matchesGame = !filters.game || key.juego?.titulo === filters.game;
      const matchesPrice =
        !filters.price || key.precio_venta >= Number(filters.price);

      return matchesPlatform && matchesGame && matchesPrice;
    });
  }, [keys, filters]);

  // Render
  return (
    <div className="key-wrapper">
      <div className="key-content">
        {sidebarOpen && (
          <aside className="key-sidebar">
            <AdminSidebar />
          </aside>
        )}

        <main className={`key-panel ${!sidebarOpen ? "no-sidebar" : ""}`}>
          <h1>Gestión de Keys</h1>

          <div className="key-form-filters-row">
            <div className="key-form-section">
              <h2>Agregar nueva Key</h2>
              <form onSubmit={handleSubmit}>
                <select
                  name="provider"
                  value={form.provider}
                  onChange={handleChange}
                  onFocus={loadProviders}
                  required
                >
                  <option value="">Proveedor</option>
                  {providers.map((prov) => (
                    <option key={prov.id_proveedor} value={prov.id_proveedor}>
                      {prov.nombre}
                    </option>
                  ))}
                </select>

                <select
                  name="game"
                  value={form.game}
                  onChange={handleChange}
                  onFocus={loadGames}
                  required
                >
                  <option value="">Juego</option>
                  {games.map((game) => (
                    <option key={game.id_juego} value={game.id_juego}>
                      {game.titulo}
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
                  {platforms.map((plat) => (
                    <option key={plat.id_plataforma} value={plat.id_plataforma}>
                      {plat.nombre}
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

            <div className="key-filters key-filters-side">
              <select
                value={filters.platform}
                onChange={(e) =>
                  setFilters({ ...filters, platform: e.target.value })
                }
              >
                <option value="">Plataforma</option>
                {platforms.map((plat) => (
                  <option key={plat.id_plataforma} value={plat.nombre}>
                    {plat.nombre}
                  </option>
                ))}
              </select>

              <select
                value={filters.game}
                onChange={(e) =>
                  setFilters({ ...filters, game: e.target.value })
                }
                onFocus={loadGames}
              >
                <option value="">Juego</option>
                {games.map((game) => (
                  <option key={game.id_juego} value={game.titulo}>
                    {game.titulo}
                  </option>
                ))}
              </select>

              <select
                value={filters.estado}
                onChange={(e) =>
                  setFilters({ ...filters, estado: e.target.value })
                }
              >
                <option value="vendida">Vendidas</option>
                <option value="">Todas</option>
              </select>

              <input
                type="number"
                placeholder="Precio mínimo"
                value={filters.price}
                onChange={(e) =>
                  setFilters({ ...filters, price: e.target.value })
                }
                min={0}
              />
            </div>
          </div>
          <div className="key-counts">
            {filters.game && selectedGameCount !== null && (
              <div className="key-count-info">
                Total de keys para {filters.game}: {selectedGameCount}
              </div>
            )}
          </div>
          {loading ? (
            <div className="loading-spinner">
              <p>Cargando keys...</p>
            </div>
          ) : (
            <>
              <div className="key-list">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Proveedor</th>
                        <th>Juego</th>
                        <th>Plataforma</th>
                        <th>Precio Compra</th>
                        <th>Precio Venta</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredKeys.map((key) => (
                        <tr key={key.id_key}>
                          <td>{key.proveedor?.nombre || "-"}</td>
                          <td>{key.juego?.titulo || "-"}</td>
                          <td>{key.plataforma?.nombre || "-"}</td>
                          <td>
                            $
                            {!isNaN(key.precio_compra)
                              ? Number(key.precio_compra).toFixed(2)
                              : "0.00"}
                          </td>
                          <td>
                            $
                            {!isNaN(key.precio_venta)
                              ? Number(key.precio_venta).toFixed(2)
                              : "0.00"}
                          </td>

                          <td>{key.estado_key?.nombre || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pagination-controls">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Anterior
                </button>

                <span>
                  Página {pagination.page} de{" "}
                  {Math.ceil(pagination.total / pagination.pageSize)}
                </span>

                <button
                  disabled={
                    pagination.page * pagination.pageSize >= pagination.total
                  }
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </main>
      </div>

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
              <a href="/admin/proveedores" className="key-fab-link">
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
