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

        const todasLasPlataformas = new Map();

        for (const k of res.data.key || []) {
          const plataforma = k.plataforma;
          const id = plataforma?.id_plataforma;
          if (!id) continue;

          if (!todasLasPlataformas.has(id)) {
            todasLasPlataformas.set(id, {
              plataforma,
              cantidad_disponible: 1,
              precio_venta: Number(k.precio_venta),
            });
          } else {
            const existente = todasLasPlataformas.get(id);
            existente.cantidad_disponible += 1;
            todasLasPlataformas.set(id, existente);
          }
        }

        // Si no hay keys, aún así extraemos plataformas del objeto juego
        const plataformasJuego = res.data.plataformas || [];
        for (const p of plataformasJuego) {
          if (!todasLasPlataformas.has(p.id_plataforma)) {
            todasLasPlataformas.set(p.id_plataforma, {
              plataforma: p,
              cantidad_disponible: 0,
              precio_venta: 0,
            });
          }
        }

        const resultado = [...todasLasPlataformas.values()];
        setPlataformas(resultado);

        const primeraDisponible = resultado.find(
          (p) => p.cantidad_disponible > 0
        );
        if (primeraDisponible) {
          setPlataformaSeleccionada(
            primeraDisponible.plataforma.id_plataforma.toString()
          );
          setMaxCantidad(primeraDisponible.cantidad_disponible);
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
      (k) => k.plataforma.id_plataforma.toString() === plataformaSeleccionada
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

  const handleComprar = async () => {
    if (!plataformaSeleccionada) {
      setError("Selecciona una plataforma.");
      return;
    }
    if (cantidad < 1 || cantidad > maxCantidad) {
      setError("Cantidad inválida.");
      return;
    }

    try {
      const plataformaData = plataformas.find(
        (p) => p.plataforma.id_plataforma.toString() === plataformaSeleccionada
      );

      if (!plataformaData || plataformaData.cantidad_disponible < cantidad) {
        setError("No hay suficientes keys disponibles.");
        return;
      }

      // 1. Traer todas las keys disponibles para esa plataforma
      const keysDisponibles =
        juego.key?.filter(
          (k) =>
            k.plataforma?.id_plataforma.toString() === plataformaSeleccionada
        ) || [];

      if (keysDisponibles.length < cantidad) {
        setError("No hay suficientes keys disponibles para esta plataforma.");
        return;
      }

      const keysSeleccionadas = keysDisponibles
        .slice(0, cantidad)
        .map((k, i) => {
          if (!k.id_key) {
            console.warn("Key sin ID encontrada en posición", i, k);
          }
          return { id_key: k.id_key };
        });

      // 2. Obtener el ID del usuario desde el objeto "user" guardado en localStorage
      const userRaw = localStorage.getItem("user");
      if (!userRaw) {
        setError("No se ha iniciado sesión.");
        return;
      }

      const user = JSON.parse(userRaw);
      const userId = user.id_usuario;
      if (!userId) {
        setError("No se ha iniciado sesión.");
        return;
      }
      console.log({
        userId,
        keys: keysSeleccionadas,
        descripcion: `Compra de ${cantidad} key(s) para ${juego.titulo}`,
      });
      // 3. Llamar al endpoint de venta
      const res = await api.post("/transaccion/venta", {
        userId,
        keys: keysSeleccionadas,
        descripcion: `Compra de ${cantidad} key(s) para ${juego.titulo}`,
      });

      // 4. Redirigir al usuario a una pantalla de éxito o pago
      navigate(`/pago/${juego.id_juego}`, {
        state: {
          juego,
          cantidad,
          plataforma: plataformaData,
          transaccion: res.data.transaccion,
        },
      });
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al procesar la compra.");
    }
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
            src={
              juego.portada ||
              `https://via.placeholder.com/220x220.png?text=${encodeURIComponent(
                juego.titulo || "Juego"
              )}`
            }
            alt={juego.titulo}
            className="compra-portada"
          />
          <div className="compra-info">
            <h2>{juego.titulo}</h2>
            <p>{juego.descripcion}</p>
            <div className="compra-meta">
              <span>
                <b>Categoría:</b> {juego.categoria?.nombre || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="compra-form">
          <label>
            Plataforma:
            <select
              value={plataformaSeleccionada}
              onChange={handlePlataformaChange}
            >
              {plataformas.length === 0 && (
                <option value="">No hay plataformas disponibles</option>
              )}
              {plataformas.map((p) => (
                <option
                  key={p.plataforma.id_plataforma}
                  value={p.plataforma.id_plataforma}
                >
                  {p.plataforma.nombre} (Disponibles)
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
              <b>Precio total: </b>$
              {(
                cantidad *
                (plataformas.find(
                  (k) =>
                    k.plataforma.id_plataforma.toString() ===
                    plataformaSeleccionada
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
