import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "./SuscripUsuario.css";
import Navbar from "../../components/Navbar"; // Asegúrate de que la ruta sea correcta

const SuscripUsuario = () => {
  const [suscripciones, setSuscripciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener usuario logueado
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id_usuario;

  useEffect(() => {
    const fetchSuscripciones = async () => {
      try {
        const res = await api.get(`/suscripciones/${userId}`);
        setSuscripciones(res.data);
      } catch (err) {
        setSuscripciones([]);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchSuscripciones();
  }, [userId]);

  if (!userId) {
    return (
      <>
        <Navbar />
        <div className="suscrip-usuario-wrapper">
          <h2>Debes iniciar sesión para ver tus suscripciones.</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="suscrip-usuario-wrapper">
        <h1>Mis Suscripciones</h1>
        {loading ? (
          <div className="suscrip-usuario-loading">Cargando suscripciones...</div>
        ) : suscripciones.length === 0 ? (
          <div className="suscrip-usuario-vacia">No tienes suscripciones activas.</div>
        ) : (
          <div className="suscrip-cards-container">
            {suscripciones.map((sus, idx) => (
              <div className="suscrip-card" key={sus.id_suscripcion || idx}>
                <div className="suscrip-card-body">
                  <h2>{sus.tipo_suscripcion?.nombre || "Sin nombre"}</h2>
                  <p className="suscrip-card-desc">
                    {sus.tipo_suscripcion?.descripcion || "Sin descripción"}
                  </p>
                  <div className="suscrip-card-info">
                    <span>
                      <b>Precio:</b> ${sus.tipo_suscripcion?.precio || "?"}
                    </span>
                    <span>
                      <b>Estado:</b> {sus.estado_suscripcion?.nombre || "Desconocido"}
                    </span>
                    <span>
                      <b>Inicio:</b> {sus.fecha_inicio?.slice(0, 10)}
                    </span>
                    <span>
                      <b>Fin:</b> {sus.fecha_fin?.slice(0, 10)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SuscripUsuario;