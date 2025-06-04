import { useEffect, useState } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./JuegoAgg.css";
import "../AdminPanel/AdminPanel.css";
import AdminSidebar from "../../components/AdminSidebar";

export default function JuegoAgg() {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Para edición rápida
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    titulo: "",
    descripcion: "",
  });

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
    api
      .get("/juego/con-portadas")
      .then((res) => {
        setJuegos(Array.isArray(res.data) ? res.data : []);
        console.log("Respuesta juegos:", res.data); // <-- AGREGA ESTO
      })
      .catch(() => setJuegos([]))
      .finally(() => setLoading(false));
  };

  const handleEdit = (juego) => {
    setEditId(juego.id_juego);
    setEditData({
      titulo: juego.titulo,
      descripcion: juego.descripcion,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      await api.patch(`/juego/${id}`, {
        titulo: editData.titulo,
        descripcion: editData.descripcion,
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
            <AdminSidebar />
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
              <div
                className="juegos-agg-cards-container"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "2rem",
                  justifyContent: "center",
                }}
              >
                {juegos.map((juego) => (
                  <div className="biblioteca-card" key={juego.id_juego}>
                    <div className="biblioteca-card-img">
                      <img
                        src={
                          juego.portada?.startsWith("http")
                            ? juego.portada
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
                          <div className="juegos-agg-edit-actions">
                            <button
                              onClick={() => handleEditSave(juego.id_juego)}
                              className="juegos-agg-btn guardar"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="juegos-agg-btn cancelar"
                            >
                              Cancelar
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h2>{juego.titulo}</h2>
                          <p className="biblioteca-card-desc">
                            {juego.descripcion}
                          </p>
                          <div className="biblioteca-card-info">
                            <span>
                              <b>Categoría:</b>{" "}
                              {juego.categoria?.nombre || "Sin categoría"}
                            </span>
                           
                          </div>
                          <div className="juegos-agg-card-actions">
                            <button
                              onClick={() => handleEdit(juego)}
                              className="juegos-agg-btn editar"
                            >
                              Editar
                            </button>
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
