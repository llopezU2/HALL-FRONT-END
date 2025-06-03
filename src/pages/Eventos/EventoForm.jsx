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
  const [eventos, setEventos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    id_juego: "",
    cantidad: "",
    id_evento_estado: 1,
  });

  const [modoEditar, setModoEditar] = useState(false);
  const [eventoActual, setEventoActual] = useState(null);

  const [juegos, setJuegos] = useState([]);
  const fechaHoy = new Date().toISOString().split("T")[0];

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

    // Validación de fechas
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Elimina la hora para comparar solo fechas
    const fechaInicio = new Date(form.fecha_inicio);
    const fechaFin = new Date(form.fecha_fin);

    if (fechaInicio < hoy) {
      Swal.fire(
        "Fecha inválida",
        "La fecha de inicio debe ser hoy o una futura",
        "warning"
      );
      return;
    }

    if (fechaFin < fechaInicio) {
      Swal.fire(
        "Fecha inválida",
        "La fecha de finalización debe ser posterior a la de inicio",
        "warning"
      );
      return;
    }

    try {
      const data = {
        ...form,
        id_juego: parseInt(form.id_juego),
        cantidad: parseInt(form.cantidad),
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
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

  const abrirModal = async () => {
    try {
      const res = await api.get("/evento");
      setEventos(res.data);
      setModalAbierto(true);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar los eventos", "error");
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
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
                min={fechaHoy}
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
                min={form.fecha_inicio || fechaHoy} // opcional: limita desde inicio
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

            <div className="boton-ver-eventos">
              <button type="button" onClick={abrirModal}>
                Ver Eventos
              </button>
            </div>

            <button type="submit">Crear Evento</button>
          </form>
        </main>
      </div>
      {modalAbierto && (
        <div className="modal-eventos-backdrop">
          <div className="modal-eventos">
            <div className="modal-header">
              <h2>Historial de Eventos</h2>
              <button className="modal-cerrar" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>

            <div className="modal-eventos-lista">
              {eventos.length === 0 ? (
                <p>No hay eventos registrados.</p>
              ) : (
                eventos.map((evento) => (
                  <div key={evento.id_evento} className="evento-card">
                    <img
                      src={
                        evento.regalo_evento?.juego?.portada ||
                        "/img/default.jpg"
                      }
                      alt={evento.regalo_evento?.juego?.titulo || "Juego"}
                      className="evento-card-img"
                    />
                    <div className="evento-card-info">
                      <h3>{evento.titulo}</h3>
                      <p>{evento.descripcion}</p>
                      <small>
                        {new Date(evento.fecha_inicio).toLocaleDateString()} -{" "}
                        {new Date(evento.fecha_fin).toLocaleDateString()}
                      </small>
                      <p className="evento-juego-titulo">
                        Juego:{" "}
                        <strong>
                          {evento.regalo_evento?.juego?.titulo ||
                            "No disponible"}
                        </strong>
                      </p>
                      <button
                        className="btn-editar"
                        onClick={() => {
                          setEventoActual(evento);
                          setModoEditar(true);
                        }}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {modoEditar && eventoActual && (
        <div className="modal-eventos-backdrop">
          <div className="modal-eventos">
            <div className="modal-header">
              <h2>Editar Evento</h2>
              <button
                className="modal-cerrar"
                onClick={() => setModoEditar(false)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await api.patch(`/evento/${eventoActual.id_evento}`, {
                    titulo: eventoActual.titulo,
                    descripcion: eventoActual.descripcion,
                    fecha_inicio: new Date(eventoActual.fecha_inicio),
                    fecha_fin: new Date(eventoActual.fecha_fin),
                    id_evento_estado: eventoActual.id_evento_estado,
                  });

                  Swal.fire(
                    "Actualizado",
                    "Evento editado correctamente",
                    "success"
                  );
                  setModoEditar(false);
                  abrirModal(); // Refrescar eventos
                } catch (err) {
                  console.error(err);
                  Swal.fire("Error", "No se pudo editar el evento", "error");
                }
              }}
            >
              <div className="input-group">
                <label>Título</label>
                <input
                  value={eventoActual.titulo}
                  onChange={(e) =>
                    setEventoActual({ ...eventoActual, titulo: e.target.value })
                  }
                />
              </div>

              <div className="input-group">
                <label>Descripción</label>
                <textarea
                  value={eventoActual.descripcion}
                  onChange={(e) =>
                    setEventoActual({
                      ...eventoActual,
                      descripcion: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>Fecha Inicio</label>
                <input
                  type="date"
                  value={
                    new Date(eventoActual.fecha_inicio)
                      .toISOString()
                      .split("T")[0]
                  }
                  min={fechaHoy}
                  onChange={(e) =>
                    setEventoActual({
                      ...eventoActual,
                      fecha_inicio: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>Fecha Fin</label>
                <input
                  type="date"
                  value={
                    new Date(eventoActual.fecha_fin).toISOString().split("T")[0]
                  }
                  min={eventoActual.fecha_inicio || fechaHoy}
                  onChange={(e) =>
                    setEventoActual({
                      ...eventoActual,
                      fecha_fin: e.target.value,
                    })
                  }
                />
              </div>

              <button type="submit" className="btn-editar">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}

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
