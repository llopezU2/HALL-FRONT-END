import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api/axiosConfig";
import "./AdminPanel.css";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminPanel() {
  const [newGame, setNewGame] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
  });
  const [newCategory, setNewCategory] = useState({
    nombre: "",
    descripcion: "",
  });
  const [newProvider, setNewProvider] = useState({
    nombre: "",
    contacto: "",
    correo: "",
  });

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.defaults.headers.common["Authorization"] = "";
    navigate("/login");
  };
  const [categorias, setCategorias] = useState([]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Ajustar layout en resize
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

  // Carga las categorías para el select
  useEffect(() => {
    api
      .get("/categoria-juego")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

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

  // Validaciones simples
  const isValidPrice = (p) => /^\d+(\.\d{1,2})?$/.test(p) && parseFloat(p) >= 0;
  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  // Submit Agregar Juego
  const handleGameSubmit = async (e) => {
    e.preventDefault();
    const { titulo, descripcion, categoria } = newGame;
    if (!titulo || !descripcion || !categoria) {
      return Swal.fire(
        "Error",
        "Completa todos los campos del juego",
        "warning"
      );
    }
    try {
      await api.post("/juego", {
        titulo,
        descripcion,
        id_categoria_juego: Number(categoria),
        cantidad: 1,
        cantidad_disponible: 1,
      });
      Swal.fire("Éxito", "Juego agregado con éxito", "success");
      setNewGame({ titulo: "", descripcion: "", precio: "", categoria: "" });
    } catch {
      alert("Error al agregar juego");
    }
  };

  // Submit Agregar Categoría
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const { nombre, descripcion } = newCategory;
    if (!nombre || !descripcion) {
      return Swal.fire(
        "Error",
        "Completa todos los campos de la categoría",
        "warning"
      );
    }
    try {
      await api.post("/categoria-juego", { nombre, descripcion });
      Swal.fire("Éxito", "Categoría agregada con éxito", "success");
    } catch {
      Swal.fire("Error", "Error al agregar categoría", "error");
    }
    setNewCategory({ nombre: "", descripcion: "" });
  };

  // Submit Agregar Proveedor
  const handleProviderSubmit = async (e) => {
    e.preventDefault();
    const { nombre, contacto, correo } = newProvider;
    if (!nombre || !contacto || !correo) {
      return Swal.fire(
        "Error",
        "Completa todos los campos del proveedor",
        "warning"
      );
    }
    if (!isValidEmail(correo)) {
      return Swal.fire("Error", "El correo no es válido", "warning");
    }
    try {
      await api.post("/proveedores", { nombre, contacto, correo });
      Swal.fire("Éxito", "Proveedor agregado con éxito", "success");
    } catch {
      Swal.fire("Error", "Error al agregar proveedor", "error");
    }

    setNewProvider({ nombre: "", contacto: "", correo: "" });
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-content">
        {sidebarOpen && <AdminSidebar />}

        <main className={`admin-panel ${!sidebarOpen ? "no-sidebar" : ""}`}>
          <h1>Panel de Administración</h1>
          <div className="form-container">
            {/* Agregar Juego */}
            <div className="form-section">
              <h2>Agregar Juego</h2>
              <form onSubmit={handleGameSubmit}>
                <input
                  type="text"
                  placeholder="Título"
                  value={newGame.titulo}
                  onChange={(e) =>
                    setNewGame({ ...newGame, titulo: e.target.value })
                  }
                />
                <textarea
                  placeholder="Descripción"
                  value={newGame.descripcion}
                  onChange={(e) =>
                    setNewGame({ ...newGame, descripcion: e.target.value })
                  }
                />
                <select
                  value={newGame.categoria}
                  onChange={(e) =>
                    setNewGame({ ...newGame, categoria: e.target.value })
                  }
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat) => (
                    <option
                      key={cat.id_categoria_juego}
                      value={cat.id_categoria_juego}
                    >
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                <button type="submit">Agregar Juego</button>
              </form>
            </div>

            {/* Agregar Categoría */}
            <div className="form-section">
              <h2>Agregar Categoría</h2>
              <form onSubmit={handleCategorySubmit}>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newCategory.nombre}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, nombre: e.target.value })
                  }
                />
                <textarea
                  placeholder="Descripción"
                  value={newCategory.descripcion}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      descripcion: e.target.value,
                    })
                  }
                />
                <button type="submit">Agregar Categoría</button>
              </form>
            </div>

            {/* Agregar Proveedor */}
            <div className="form-section">
              <h2>Agregar Proveedor</h2>
              <form onSubmit={handleProviderSubmit}>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newProvider.nombre}
                  onChange={(e) =>
                    setNewProvider({ ...newProvider, nombre: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Contacto"
                  value={newProvider.contacto}
                  onChange={(e) =>
                    setNewProvider({ ...newProvider, contacto: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Correo"
                  value={newProvider.correo}
                  onChange={(e) =>
                    setNewProvider({ ...newProvider, correo: e.target.value })
                  }
                />
                <button type="submit">Agregar Proveedor</button>
              </form>
            </div>

            {/*
              <div className="form-section">
                <h2>Agregar Evento</h2>
                <form onSubmit={handleEventSubmit}>
                  <input
                    type="text"
                    placeholder="Título del evento"
                    value={newEvent.titulo}
                    onChange={e => setNewEvent({ ...newEvent, titulo: e.target.value })}
                  />
                  <input
                    type="datetime-local"
                    value={newEvent.fecha_inicio}
                    onChange={e => setNewEvent({ ...newEvent, fecha_inicio: e.target.value })}
                  />
                  <input
                    type="datetime-local"
                    value={newEvent.fecha_fin}
                    onChange={e => setNewEvent({ ...newEvent, fecha_fin: e.target.value })}
                  />
                  <textarea
                    placeholder="Descripción"
                    value={newEvent.descripcion}
                    onChange={e => setNewEvent({ ...newEvent, descripcion: e.target.value })}
                  />
                  <button type="submit">Agregar Evento</button>
                </form>
              </div>

              <div className="form-section">
                <h2>Agregar Tipo de Suscripción</h2>
                <form onSubmit={handleSubscriptionSubmit}>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={newSubscriptionType.nombre}
                    onChange={e => setNewSubscriptionType({ ...newSubscriptionType, nombre: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Precio"
                    value={newSubscriptionType.precio}
                    onChange={e => setNewSubscriptionType({ ...newSubscriptionType, precio: e.target.value })}
                  />
                  <button type="submit">Agregar Tipo de Suscripción</button>
                </form>
              </div>
            */}
          </div>
        </main>
      </div>

      {/* Botón flotante solo para móvil */}
      {isMobile && (
        <div className="floating-button-container">
          {(fabMenuOpen || isClosing) && (
            <div className={`fab-menu ${isClosing ? "fade-out" : "fade-in"}`}>
              <a href="/admin/categorias" className="fab-link">
                Ver Categorías
              </a>
              <a href="/admin/suscripciones" className="fab-link">
                Ver Suscripciones
              </a>
            </div>
          )}

          <button className="fab-toggle" onClick={toggleFabMenu}>
            <FaBars />
          </button>
        </div>
      )}
    </div>
  );
}
