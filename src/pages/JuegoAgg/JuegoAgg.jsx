import { useEffect, useState } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./JuegoAgg.css";
import "../AdminPanel/AdminPanel.css";

export default function JuegoAgg() {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Para edición rápida
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ titulo: "", descripcion: "", precio: "" });

  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchJuegos();
    // eslint-disable-next-line
  }, []);

  const fetchJuegos = () => {
    setLoading(true);
    api.get("/juego/con-portadas")
      .then(res => {
        setJuegos(Array.isArray(res.data) ? res.data : []);
        console.log("Respuesta juegos:", res.data); // <-- AGREGA ESTO
      })
      .catch(() => setJuegos([]))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este juego?")) return;
    try {
      await api.delete(`/juego/${id}`);
      setJuegos(juegos.filter(j => j.id_juego !== id));
    } catch {
      alert("Error al eliminar el juego.");
    }
  };

  const handleEdit = (juego) => {
    setEditId(juego.id_juego);
    setEditData({
      titulo: juego.titulo,
      descripcion: juego.descripcion,
      precio: juego.precio,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      await api.put(`/juego/${id}`, {
        titulo: editData.titulo,
        descripcion: editData.descripcion,
        precio: editData.precio,
      });
      setEditId(null);
      fetchJuegos();
    } catch {
      alert("Error al guardar los cambios.");
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.defaults.headers.common["Authorization"] = "";
    navigate("/login");
  };

  // Sidebar active
  const activePath = "/admin/juegos";

  return (
    <div className="admin-wrapper">
      <div className="admin-content">
        {sidebarOpen && (
          <aside className="admin-sidebar">
            <div className="sidebar-logo">
              <img
                src="../src/img/LogoOficialGrande.png"
                alt="Logo Oficial"
                className="logo-img"
              />
            </div>
            <h3>Panel Admin</h3>
            <ul>
              <li>
                <a href="/admin/categorias" className={activePath === "/admin/categorias" ? "active" : ""}>
                  Ver Categorías
                </a>
              </li>
              <li>
                <a href="/admin/suscripciones" className={activePath === "/admin/suscripciones" ? "active" : ""}>
                  Ver Suscripciones
                </a>
              </li>
              <li>
                <a href="/admin/proveedores" className={activePath === "/admin/proveedores" ? "active" : ""}>
                  Ver Proveedores
                </a>
              </li>
              <li>
                <a href="/admin/key" className={activePath === "/admin/key" ? "active" : ""}>
                  Ver Keys
                </a>
              </li>
              <li>
                <a href="/admin/juegos" className={activePath === "/admin/juegos" ? "active" : ""}>
                  Ver Juegos
                </a>
              </li>
              <li>
                <a href="/admin">Volver al Panel</a>
              </li>
              <li>
                <a href="/profile" className={activePath === "/profile" ? "active" : ""}>
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
        )}

        <main className={`admin-panel ${!sidebarOpen ? "no-sidebar" : ""}`}>
          <div className="juegos-agg-usuario-wrapper">
            <h1>Juegos Agregados</h1>
            {loading ? (
              <div className="juegos-agg-loading">Cargando juegos...</div>
            ) : juegos.length === 0 ? (
              <div className="juegos-agg-empty">No hay juegos registrados.</div>
            ) : (
              <div className="juegos-agg-cards-container" style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center" }}>
                {juegos.map((juego) => (
                  <div className="biblioteca-card" key={juego.id_juego}>
                    <div className="biblioteca-card-img">
                      <img
                        src={
                          juego.portada
                            ? `${import.meta.env.VITE_API_URL}${juego.portada.startsWith("/") ? juego.portada : `/${juego.portada}`}`
                            : "/img/placeholder-game.png"
                        }
                        alt={juego.titulo}
                      />
                    </div>
                    <div className="biblioteca-card-body">
                      {editId === juego.id_juego ? (
                        <>
                          <input
                            type="text"
                            name="titulo"
                            value={editData.titulo}
                            onChange={handleEditChange}
                            className="juegos-agg-edit-input"
                          />
                          <textarea
                            name="descripcion"
                            value={editData.descripcion}
                            onChange={handleEditChange}
                            className="juegos-agg-edit-textarea"
                          />
                          <input
                            type="text"
                            name="precio"
                            value={editData.precio}
                            onChange={handleEditChange}
                            className="juegos-agg-edit-input"
                          />
                          <div className="juegos-agg-edit-actions">
                            <button onClick={() => handleEditSave(juego.id_juego)} className="juegos-agg-btn guardar">Guardar</button>
                            <button onClick={handleEditCancel} className="juegos-agg-btn cancelar">Cancelar</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h2>{juego.titulo}</h2>
                          <p className="biblioteca-card-desc">{juego.descripcion}</p>
                          <div className="biblioteca-card-info">
                            <span>
                              <b>Categoría:</b> {juego.categoria?.nombre || "Sin categoría"}
                            </span>
                            <span>
                              <b>Precio:</b> ${juego.precio}
                            </span>
                          </div>
                          <div className="juegos-agg-card-actions">
                            <button onClick={() => handleEdit(juego)} className="juegos-agg-btn editar">Editar</button>
                            <button onClick={() => handleDelete(juego.id_juego)} className="juegos-agg-btn eliminar">Eliminar</button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}