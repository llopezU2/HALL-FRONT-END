import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/AdminSidebar";
import "./EventoForm.css";
import { FaBars } from "react-icons/fa";

export default function EventoForm() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    id_juego: "",
    cantidad: "",
    id_evento_estado: 1,
  });

  const [juegos, setJuegos] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    api.get("/juego").then((res) => {
      setJuegos(res.data);
    });

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFabMenu = () => {
    if (fabMenuOpen) {
      setFabMenuOpen(false);
      setTimeout(() => setShowFabMenu(false), 250);
    } else {
      setShowFabMenu(true);
      setTimeout(() => setFabMenuOpen(true), 10);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...form,
        id_juego: parseInt(form.id_juego),
        cantidad: parseInt(form.cantidad),
        fecha_inicio: new Date(form.fecha_inicio),
        fecha_fin: new Date(form.fecha_fin),
      };

      await api.post("/evento", data);

      Swal.fire("Éxito", "Evento creado correctamente", "success");

      setForm({
        titulo: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        id_juego: "",
        cantidad: "",
        id_evento_estado: 1,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo crear el evento", "error");
    }
  };

  return (
    <div className="evento-wrapper">
      <div className="evento-content">
        {sidebarOpen && (
          <aside className="evento-sidebar">
            <AdminSidebar />
          </aside>
        )}

        <main className={`evento-panel ${!sidebarOpen ? "no-sidebar" : ""}`}>
          <h1>Crear Evento</h1>
          <form className="evento-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                id="titulo"
                name="titulo"
                placeholder="Título del evento"
                value={form.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Descripción del evento"
                value={form.descripcion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="fecha_inicio">Fecha de inicio</label>
              <input
                id="fecha_inicio"
                type="date"
                name="fecha_inicio"
                value={form.fecha_inicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="fecha_fin">Fecha de finalización</label>
              <input
                id="fecha_fin"
                type="date"
                name="fecha_fin"
                value={form.fecha_fin}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="id_juego">Juego relacionado</label>
              <select
                id="id_juego"
                name="id_juego"
                value={form.id_juego}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un juego</option>
                {juegos.map((j) => (
                  <option key={j.id_juego} value={j.id_juego}>
                    {j.titulo}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="cantidad">Cantidad de regalos</label>
              <input
                id="cantidad"
                type="number"
                name="cantidad"
                placeholder="Cantidad de regalos"
                value={form.cantidad}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Crear Evento</button>
          </form>
        </main>
      </div>

      {isMobile && (
        <>
          <button className="evento-fab-toggle" onClick={toggleFabMenu}>
            <FaBars />
          </button>

          {showFabMenu && (
            <div
              className={`evento-fab-menu-container ${
                fabMenuOpen ? "fade-in" : "fade-out"
              }`}
            >
              <a href="/admin" className="evento-fab-link">
                Volver al Panel
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
