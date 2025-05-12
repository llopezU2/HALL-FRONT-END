import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import GameCardList from "../../components/GameCardList";
import "./Juego.css";

export default function Juego() {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const [relatedGames, setRelatedGames] = useState([]);

  useEffect(() => {
    // Traer detalles del juego
    api
      .get(`/juego/${id}`)
      .then((res) => setGameDetails(res.data))
      .catch((err) => console.error("Error al cargar juego:", err));

    // Traer recomendaciones
    api
      .get("/juego/recomendados")
      .then((res) => setRelatedGames(res.data))
      .catch((err) => console.error("Error al cargar recomendados:", err));
  }, [id]);

  if (!gameDetails) {
    return <p>Cargando...</p>;
  }

  // Normaliza la URL de la portada
  const rawPortada = gameDetails.portada || "";
  const gameImageUrl = rawPortada.startsWith("http")
    ? rawPortada
    : `${import.meta.env.VITE_API_URL}${
        rawPortada.startsWith("/") ? rawPortada : `/${rawPortada}`
      }`;

  return (
    <div className="juego-container">
      <Navbar />

      <div className="juego-details">
        {rawPortada && (
          <img
            src={gameImageUrl}
            alt={gameDetails.titulo}
            className="juego-portada"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}

        <h2 className="juego-title">{gameDetails.titulo}</h2>
        <p className="juego-description">{gameDetails.descripcion}</p>

        {gameDetails.precio != null && (
          <p className="juego-precio">{gameDetails.precio.toFixed(2)} €</p>
        )}

        <div className="juego-actions">
          <button className="styled-buy-button">Comprar ahora</button>
        </div>
      </div>

      <div className="related-games">
        <h3>Juegos Relacionados</h3>
        <GameCardList games={relatedGames} />
      </div>
    </div>
  );
}
