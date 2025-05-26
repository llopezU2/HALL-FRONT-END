import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "./SuscripUsuario.css";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";

const SuscripUsuario = () => {
  const [suscripcionActiva, setSuscripcionActiva] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id_usuario;

  useEffect(() => {
    const fetchSuscripciones = async () => {
      try {
        const [resActiva, resHistorial] = await Promise.all([
          api.get(`/suscripcion/${userId}/activa`),
          api.get(`/suscripcion/${userId}/historial`),
        ]);
        setSuscripcionActiva(resActiva.data);
        setHistorial(resHistorial.data);
      } catch (err) {
        console.error("Error al cargar suscripciones:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchSuscripciones();
  }, [userId]);

  const cancelarRenovacion = async () => {
    try {
      await api.post("/suscripcion/cancelar-renovacion", {
        id_usuario: userId,
      });

      Swal.fire({
        icon: "success",
        title: "Renovación cancelada",
        text: "La renovación automática fue desactivada.",
        confirmButtonColor: "#3b82f6",
      });

      // Volver a cargar datos
      const resActiva = await api.get(`/suscripcion/${userId}/activa`);
      setSuscripcionActiva(resActiva.data);
    } catch (err) {
      console.error("Error al cancelar renovación:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cancelar la renovación automática.",
      });
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
          <div className="suscrip-usuario-loading">Cargando...</div>
        ) : (
          <>
            <div className="suscrip-grid">
              {/* Columna IZQUIERDA: Activa */}
              <div className="suscrip-col">
                <h2>Suscripción Activa</h2>
                {suscripcionActiva ? (
                  <div className="suscrip-card activa">
                    <h2>{suscripcionActiva.tipo_suscripcion.nombre}</h2>
                    <p className="suscrip-card-desc">
                      Estado: {suscripcionActiva.estado_suscripcion.nombre}
                    </p>
                    <div className="suscrip-card-info">
                      <span>
                        <b>Precio:</b> $
                        {suscripcionActiva.tipo_suscripcion.precio}
                      </span>
                      <span>
                        <b>Inicio:</b>{" "}
                        {suscripcionActiva.fecha_inicio?.slice(0, 10)}
                      </span>
                      <span>
                        <b>Fin:</b> {suscripcionActiva.fecha_fin?.slice(0, 10)}
                      </span>
                      <span>
                        <b>Renovación:</b>{" "}
                        {suscripcionActiva.renovacion_automatica ? "Sí" : "No"}
                      </span>
                    </div>
                    {suscripcionActiva.renovacion_automatica && (
                      <button
                        className="btn-cancelar-renovacion"
                        onClick={cancelarRenovacion}
                      >
                        Cancelar renovación automática
                      </button>
                    )}
                  </div>
                ) : (
                  <p>No tienes una suscripción activa actualmente.</p>
                )}
              </div>

              {/* Columna DERECHA: Historial */}
              <div className="suscrip-col">
                <h2>Historial de Suscripciones</h2>
                {historial.length === 0 ? (
                  <p>No hay suscripciones anteriores.</p>
                ) : (
                  historial.map((sus, idx) => (
                    <div className="suscrip-card historial" key={idx}>
                      <h3>{sus.tipo_suscripcion.nombre}</h3>
                      <p className="suscrip-card-desc">
                        Estado: {sus.estado_suscripcion.nombre}
                      </p>
                      <div className="suscrip-card-info">
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
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SuscripUsuario;
