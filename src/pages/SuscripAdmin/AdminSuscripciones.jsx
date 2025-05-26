import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "./AdminSuscripciones.css";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminSuscripciones() {
  const [tipos, setTipos] = useState([]);
  const [semana, setSemana] = useState(1);
  const [mensaje, setMensaje] = useState("");

  const obtenerSemanaActual = async () => {
    const res = await api.get("/configuracion");
    setSemana(res.data.semana_global);
  };

  useEffect(() => {
    obtenerTipos();
  }, []);

  const obtenerTipos = async () => {
    try {
      const res = await api.get("/suscripcion/tipos");
      setTipos(res.data);
    } catch (error) {
      console.error("Error al cargar tipos:", error);
    }
  };

  const asignarJuegosSemana = async () => {
    try {
      const res = await api.post("/suscripcion/asignar-juegos-semana", {
        semana_global: semana,
      });
      setMensaje(res.data.mensaje);
      obtenerTipos();
    } catch (error) {
      console.error("Error al asignar juegos:", error);
    }
  };

  const asignarJuegosUsuarios = async () => {
    try {
      const res = await api.post("/suscripcion/asignar-juegos-usuarios");
      setMensaje(res.data.mensaje);
    } catch (error) {
      console.error("Error al asignar a usuarios:", error);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-content">
        <AdminSidebar />

        <main className="admin-panel">
          <h1>Gestión de Juegos por Suscripción</h1>

          <div className="acciones">
            <label>
              Semana Global:
              <input
                type="number"
                value={semana}
                onChange={(e) => setSemana(Number(e.target.value))}
                min={1}
              />
            </label>
            <button onClick={asignarJuegosSemana}>
              Asignar Juegos a Planes
            </button>
            <button onClick={asignarJuegosUsuarios}>
              Asignar Juegos a Usuarios
            </button>
          </div>

          {mensaje && <p className="mensaje">{mensaje}</p>}

          <h2>Planes y Juegos de la Semana</h2>
          <div className="tipos-container">
            {tipos.map((tipo) => (
              <div key={tipo.id_tipo_suscripcion} className="tipo-card">
                <h3>{tipo.nombre}</h3>
                <p>Precio: ${tipo.precio}</p>
                {tipo.juegoActual ? (
                  <>
                    <img
                      src={tipo.juegoActual.portada}
                      alt="Portada"
                      className="portada"
                    />
                    <p>
                      <strong>{tipo.juegoActual.titulo}</strong>
                    </p>
                  </>
                ) : (
                  <p>No se ha asignado un juego para esta semana.</p>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
