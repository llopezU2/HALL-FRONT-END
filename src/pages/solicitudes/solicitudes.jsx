// src/pages/solicitudes/solicitudes.jsx
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "../solicitudes/solicitudes.css";

export default function Solicitudes() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id_usuario;

  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    if (userId) fetchSolicitudes();
  }, [userId]);

  const fetchSolicitudes = () => {
    api
      .get(`/solicitud/received/${userId}`)
      .then((res) => setSolicitudes(res.data))
      .catch((err) => console.error(err));
  };

  const manejarAccion = (id, accion) => {
    const aceptar = accion === "aceptar";
    api
      .patch(`/solicitud/respond/${id}`, null, { params: { aceptar } })
      .then(() => fetchSolicitudes())
      .catch((err) => console.error(err));
  };

  return (
    <Layout>
      <div className="solicitudes-container">
        <h2>Solicitudes de Amistad Recibidas</h2>
        {!userId ? (
          <p>Cargando usuario…</p>
        ) : solicitudes.length === 0 ? (
          <p>No hay solicitudes pendientes.</p>
        ) : (
          <ul>
            {solicitudes.map((s) => (
              <li key={s.id_solicitud}>
                <div className="solicitante-info">
                  <strong>{s.solicitante.nombre}</strong>
                  <br />
                  <small>
                    Enviada: {new Date(s.fecha_solicitud).toLocaleString()}
                  </small>
                </div>
                <div className="acciones">
                  <button
                    className="btn-aceptar"
                    onClick={() => manejarAccion(s.id_solicitud, "aceptar")}
                  >
                    Aceptar
                  </button>
                  <button
                    className="btn-rechazar"
                    onClick={() => manejarAccion(s.id_solicitud, "rechazar")}
                  >
                    Rechazar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
