import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "../solicitudes/solicitudes.css";

export default function Solicitudes() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id_usuario;

  const [solicitudes, setSolicitudes] = useState([]);
  const [amistades, setAmistades] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchSolicitudes();
      fetchAmistades();
    }
  }, [userId]);

  const fetchSolicitudes = () => {
    api
      .get(`/solicitud/received/${userId}`)
      .then((res) => setSolicitudes(res.data))
      .catch((err) => console.error(err));
  };

  const fetchAmistades = () => {
    api
      .get(`/amistad/${userId}`)
      .then((res) => {
        setAmistades(res.data);
      })
      .catch((err) => console.error(err));
  };

  const manejarAccion = (id, accion) => {
    const aceptar = accion === "aceptar";
    api
      .patch(`/solicitud/respond/${id}`, null, { params: { aceptar } })
      .then(() => {
        fetchSolicitudes();
        if (aceptar) {
          fetchAmistades(); // ← esto se agrega para actualizar amistades
        }
      })
      .catch((err) => console.error(err));
  };
  

  return (
    <Layout>
      <div className="solicitudes-grid">
        {/* Izquierda: Amistades */}
        <div className="solicitudes-left">
          <h2>Amigos</h2>
          {amistades.length === 0 ? (
            <p className="texto-centrado">No tenés amigos todavía.</p>
          ) : (
            amistades.map((amigo) => (
              <div key={amigo.id_usuario} className="tarjeta-usuario">
                <img
                  src={`https://ui-avatars.com/api/?name=${amigo.nombre}&background=60a5fa&color=fff`}
                  alt="Avatar"
                  className="avatar"
                />
                <div className="usuario-info">
                  <strong>{amigo.nombre}</strong>
                  <small>{amigo.email}</small>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Derecha: Solicitudes */}
        <div className="solicitudes-right">
          <h2>Solicitudes de Amistad Recibidas</h2>
          {!userId ? (
            <p className="texto-centrado">Cargando usuario…</p>
          ) : solicitudes.length === 0 ? (
            <p className="texto-centrado">No hay solicitudes pendientes.</p>
          ) : (
            solicitudes.map((s) => (
              <div key={s.id_solicitud} className="tarjeta-usuario">
                <img
                  src={`https://ui-avatars.com/api/?name=${s.solicitante.nombre}&background=3b82f6&color=fff`}
                  alt="Avatar"
                  className="avatar"
                />
                <div className="usuario-info">
                  <strong>{s.solicitante.nombre}</strong>
                  <small>
                    Enviada: {new Date(s.fecha_solicitud).toLocaleDateString()}
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
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
