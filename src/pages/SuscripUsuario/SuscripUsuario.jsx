import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "./SuscripUsuario.css";
import Navbar from "../../components/Navbar";

const SuscripUsuario = () => {
  const [suscripciones, setSuscripciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id_usuario;

  useEffect(() => {
    const fetchSuscripciones = async () => {
      try {
        const res = await api.get(`/suscripcion/${userId}`);
        console.log("Respuesta del backend:", res.data);
        setSuscripciones(res.data);
      } catch (err) {
        console.error("Error al cargar suscripciones:", err);
        setSuscripciones([]);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchSuscripciones();
  }, [userId]);

  const cancelarRenovacion = async () => {
    try {
      const res = await api.post("/suscripcion/cancelar-renovacion", {
        id_usuario: userId,
      });
      alert("Renovación automática cancelada con éxito.");
      // Vuelve a cargar para reflejar cambios
      const res2 = await api.get(`/suscripciones/${userId}`);
      setSuscripciones(res2.data);
    } catch (err) {
      console.error("Error al cancelar renovación:", err);
      alert("Ocurrió un error al cancelar la renovación.");
    }
  };

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
          <div className="suscrip-usuario-loading">
            Cargando suscripciones...
          </div>
        ) : suscripciones.length === 0 ? (
          <div className="suscrip-usuario-vacia">
            No tienes suscripciones activas.
          </div>
        ) : (
          <div className="suscrip-cards-container">
            {suscripciones.map((sus, idx) => (
              <div className="suscrip-card" key={sus.id_suscripcion || idx}>
                <div className="suscrip-card-body">
                  <h2>{sus.tipo_suscripcion?.nombre || "Sin nombre"}</h2>
                  <p className="suscrip-card-desc">
                    Suscripción{" "}
                    {sus.estado_suscripcion?.nombre || "desconocida"}
                  </p>
                  <div className="suscrip-card-info">
                    <span>
                      <b>Precio:</b> ${sus.tipo_suscripcion?.precio || "?"}
                    </span>
                    <span>
                      <b>Inicio:</b> {sus.fecha_inicio?.slice(0, 10)}
                    </span>
                    <span>
                      <b>Fin:</b> {sus.fecha_fin?.slice(0, 10)}
                    </span>
                    <span>
                      <b>Renovación:</b>{" "}
                      {sus.renovacion_automatica ? "Sí" : "No"}
                    </span>
                  </div>

                  {sus.renovacion_automatica && (
                    <button
                      className="btn-cancelar-renovacion"
                      onClick={cancelarRenovacion}
                    >
                      Cancelar renovación automática
                    </button>
                  )}
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
