import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import "./CompraUsuario.css";

export default function CompraUsuario() {
  const { id } = useParams(); // id del juego
  const navigate = useNavigate();
  const [juego, setJuego] = useState(null);
  const [plataformas, setPlataformas] = useState([]);
  const [plataformaSeleccionada, setPlataformaSeleccionada] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [maxCantidad, setMaxCantidad] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Traer info del juego y plataformas disponibles
  useEffect(() => {
    const fetchJuego = async () => {
      try {
        const res = await api.get(`/juego/${id}`);
        setJuego(res.data);
        console.log("Keys recibidas:", res.data.key); // <-- Agrega esto
        const disponibles = (res.data.key || []).filter(
          k => k.plataforma && k.plataforma.id_plataforma && k.plataforma.nombre
        );
        setPlataformas(disponibles);
        if (disponibles.length > 0) {
          setPlataformaSeleccionada(disponibles[0].plataforma.id_plataforma.toString());
          setMaxCantidad(1); // O el valor que tengas disponible
        }
      } catch (err) {
        setError("No se pudo cargar la información del juego.");
      } finally {
        setLoading(false);
      }
    };
    fetchJuego();
  }, [id]);

  // Cambia la cantidad máxima según la plataforma seleccionada
  useEffect(() => {
    const key = plataformas.find(
      k => k.plataforma.id_plataforma.toString() === plataformaSeleccionada
    );
    setMaxCantidad(key ? key.cantidad_disponible : 1);
    if (cantidad > (key ? key.cantidad_disponible : 1)) setCantidad(1);
  }, [plataformaSeleccionada, plataformas]);

  const handleCantidadChange = (e) => {
    const val = Number(e.target.value);
    if (val > maxCantidad) {
      setCantidad(maxCantidad);
      setError("No puedes comprar más keys de las disponibles.");
    } else {
      setCantidad(val);
      setError("");
    }
  };

  const handlePlataformaChange = (e) => {
    setPlataformaSeleccionada(e.target.value);
    setError("");
  };

  const handleComprar = () => {
    if (!plataformaSeleccionada) {
      setError("Selecciona una plataforma.");
      return;
    }
    if (cantidad < 1 || cantidad > maxCantidad) {
      setError("Cantidad inválida.");
      return;
    }
    // Navega a la vista de pago, pasando datos por estado
    navigate(`/pago/${juego.id_juego}`, {
      state: {
        juego,
        cantidad,
        plataforma: plataformas.find(
          k => k.plataforma.id_plataforma.toString() === plataformaSeleccionada
        ),
      },
    });
  };

  if (loading) return <div className="compra-loading">Cargando...</div>;
  if (error) return <div className="compra-error">{error}</div>;
  if (!juego) return null;

  return (
    <>
      <Navbar />
      <div className="compra-wrapper">
        <div className="compra-juego">
          <img
            src={juego.portada || `https://via.placeholder.com/220x220.png?text=${encodeURIComponent(juego.titulo || "Juego")}`}
            alt={juego.titulo}
            className="compra-portada"
          />
          <div className="compra-info">
            <h2>{juego.titulo}</h2>
            <p>{juego.descripcion}</p>
            <div className="compra-meta">
              <span><b>Categoría:</b> {juego.categoria?.nombre || "N/A"}</span>
            </div>
          </div>
        </div>
        <div className="compra-form">
          <label>
            Plataforma:
            <select value={plataformaSeleccionada} onChange={handlePlataformaChange}>
              {plataformas.length === 0 && (
                <option value="">No hay plataformas disponibles</option>
              )}
              {plataformas.map((k) => (
                <option
                  key={k.plataforma.id_plataforma}
                  value={k.plataforma.id_plataforma}
                >
                  {k.plataforma.nombre} (Disponibles: {k.cantidad_disponible})
                </option>
              ))}
            </select>
          </label>
          <label>
            Cantidad:
            <input
              type="number"
              min="1"
              max={maxCantidad}
              value={cantidad}
              onChange={handleCantidadChange}
              disabled={plataformas.length === 0}
            />
          </label>
          {plataformas.length > 0 && (
            <div className="compra-precio">
              <b>Precio total: </b>
              $
              {(
                cantidad *
                (plataformas.find(
                  k => k.plataforma.id_plataforma.toString() === plataformaSeleccionada
                )?.precio_venta || 0)
              ).toFixed(2)}
            </div>
          )}
          {plataformas.length === 0 && (
            <div className="compra-advertencia">
              No hay keys disponibles para ninguna plataforma.
            </div>
          )}
          {error && <div className="compra-error">{error}</div>}
          <button
            className="compra-boton"
            onClick={handleComprar}
            disabled={plataformas.length === 0}
          >
            Proceder al pago
          </button>
        </div>
      </div>
    </>
  );
}