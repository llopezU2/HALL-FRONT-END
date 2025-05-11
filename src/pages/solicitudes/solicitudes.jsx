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
  const [modalUsuario, setModalUsuario] = useState(null); // Para el modal de amistad
  const [confirmDelete, setConfirmDelete] = useState(null); // Para el mini-modal de confirmación de eliminar

  // Fetch solicitudes y amistades
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

  const eliminarAmistad = (id_amigo) => {
    api
      .delete(`/amistad/eliminar/${id_amigo}`)
      .then(() => {
        fetchAmistades(); // Para actualizar la lista de amistades
        setConfirmDelete(null); // Cerrar el mini-modal
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
              <div
                key={amigo.id_usuario}
                className="tarjeta-usuario"
                onClick={() => setModalUsuario(amigo)} 
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${amigo.nombre}&background=60a5fa&color=fff`}
                  alt="Avatar"
                  className="avatar"
                />
                <div className="usuario-info">
                  <strong>{amigo.nombre}</strong>
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

      {/* Modal de usuario (Amistad) */}
      {modalUsuario && (
        <div className="modal-overlay" onClick={() => setModalUsuario(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalUsuario.nombre}</h2>
            <p>Email: {modalUsuario.email}</p>
            <div className="modal-buttons">
              <button className="styled-button">Ver Biblioteca</button>
              <button
                className="styled-button eliminar"
                onClick={() => setConfirmDelete(modalUsuario.id_usuario)}
              >
                Eliminar amistad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mini-modal de confirmación de eliminar amistad */}
      {confirmDelete && (
        <div className="mini-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="mini-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>¿Estás seguro que quieres eliminar esta amistad?</h3>
            <div className="mini-modal-buttons">
              <button
                className="styled-button eliminar"
                onClick={() => eliminarAmistad(confirmDelete)}
              >
                Eliminar
              </button>
              <button className="styled-button" onClick={() => setConfirmDelete(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
