import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";
import "./WidgetFlotante.css";

export default function WidgetFlotante() {
  const [abierto, setAbierto] = useState(false);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const cargarEventos = () => {
      api
        .get("/evento")
        .then((res) => {
          const eventosOrdenados = res.data.sort(
            (a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio)
          );
          setEventos(eventosOrdenados);
        })
        .catch((err) => {
          console.error("Error al cargar eventos:", err);
        });
    };

    cargarEventos();

    const listener = () => cargarEventos();
    window.addEventListener("eventoCreado", listener);
    return () => window.removeEventListener("eventoCreado", listener);
  }, []);

  const participarEnEvento = async (evento) => {
    const confirmar = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas participar en el evento "${evento.titulo}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, participar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmar.isConfirmed) return;

    try {
      const res = await api.post(`/evento/${evento.id_evento}/participar`);

      Swal.fire({
        title: "🎉 ¡Felicidades!",
        html: `Recibiste tu key`,
        icon: "success",
      });

      const actualizados = await api.get("/evento");
      const ordenados = actualizados.data.sort(
        (a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio)
      );
      setEventos(ordenados);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Ocurrió un error al participar en el evento",
        icon: "error",
      });
    }
  };

  return (
    <div className="widget-flotante-wrapper">
      <button
        className="widget-boton-toggle"
        onClick={() => setAbierto(!abierto)}
      >
        {abierto ? "×" : "🎉"}
      </button>

      {abierto && (
        <div className="widget-eventos-glass">
          <h3>🎮 Eventos activos</h3>
          <div className="eventos-lista">
            {eventos.map((evento) => (
              <div className="evento-card" key={evento.id_evento}>
                <img
                  src={
                    evento.regalo_evento?.juego?.portada ||
                    "/img/fallback-evento.jpg"
                  }
                  alt={evento.titulo}
                  onError={(e) => (e.target.src = "/img/fallback-evento.jpg")}
                />
                <div className="evento-info">
                  <h4>{evento.titulo}</h4>
                  <p className="evento-fechas">
                    Del {evento.fecha_inicio?.substring(0, 10)} al{" "}
                    {evento.fecha_fin?.substring(0, 10)}
                  </p>
                  <p className="evento-descripcion">{evento.descripcion}</p>
                  <button
                    className="btn-participar"
                    onClick={() => participarEnEvento(evento)}
                    disabled={evento.regalo_evento?.cantidad_disponible <= 0}
                  >
                    {evento.regalo_evento?.cantidad_disponible > 0
                      ? "🎁 Participar"
                      : "Sin stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
