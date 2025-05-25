import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import "./Plataforma.css";

export default function Plataforma() {
  const { id_plataforma } = useParams();
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombrePlataforma, setNombrePlataforma] = useState("");

  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        const response = await api.get(`/juego/plataforma/${id_plataforma}/con-portadas`);
        setJuegos(Array.isArray(response.data) ? response.data : []);
        // Si hay juegos, toma el nombre de la plataforma de la primera key encontrada
        if (Array.isArray(response.data) && response.data.length > 0) {
          const primerJuego = response.data[0];
          const keyPlataforma = primerJuego.key?.find(
            k => k.plataforma?.id_plataforma?.toString() === id_plataforma
          );
          setNombrePlataforma(keyPlataforma?.plataforma?.nombre || "");
        } else {
          setNombrePlataforma("");
        }
      } catch (err) {
        console.error("Error al cargar juegos:", err);
        setJuegos([]);
        setNombrePlataforma("");
      } finally {
        setLoading(false);
      }
    };
    fetchJuegos();
  }, [id_plataforma]);

  return (
    <>
      <Navbar />
      <div className="plataforma-wrapper">
        <h1>
          Juegos para {nombrePlataforma ? nombrePlataforma : ""}
        </h1>
        {loading ? (
          <p className="plataforma-loading">Cargando juegos...</p>
        ) : juegos.length === 0 ? (
          <p className="plataforma-vacia">No hay juegos disponibles para esta plataforma.</p>
        ) : (
          <ul className="juegos-lista">
            {juegos.map(juego => {
              const keyPlataforma = juego.key?.find(
                k => k.plataforma?.id_plataforma?.toString() === id_plataforma
              );
              return (
                <li key={juego.id_juego} className="juego-list-item">
                  <Link to={`/juego/${juego.id_juego}`} className="juego-list-link">
                    <div className="juego-list-img">
                      <img
                        src={juego.portada || `https://via.placeholder.com/120x120.png?text=${encodeURIComponent(juego.titulo || "Juego")}`}
                        alt={`Portada de ${juego.titulo || "Juego"}`}
                      />
                    </div>
                    <div className="juego-list-info">
                      <h2>{juego.titulo || "Sin título"}</h2>
                      <p className="juego-list-desc">
                        {juego.descripcion?.slice(0, 100) || "Sin descripción."}
                      </p>
                      <div className="juego-list-meta">
                        <span><b>Categoría:</b> {juego.categoria?.nombre || "N/A"}</span>
                        <span><b>Disponibles:</b> {juego.cantidad_disponible ?? 0}</span>
                        <span><b>Plataforma:</b> {keyPlataforma?.plataforma?.nombre || "N/A"}</span>
                        <span><b>Precio:</b> ${keyPlataforma?.precio_venta ? Number(keyPlataforma.precio_venta).toFixed(2) : "N/D"}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
