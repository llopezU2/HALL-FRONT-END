import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar"; // Importa la Navbar
import GameCardList from "../../components/GameCardList";
import "./Juego.css";

export default function Juego() {
  const { id } = useParams(); // Obtener el ID del juego desde la URL
  const [gameDetails, setGameDetails] = useState(null);
  const [relatedGames, setRelatedGames] = useState([]); // Juegos relacionados

  // Obtener detalles del juego
  useEffect(() => {
    api
      .get(`/juego/${id}`)
      .then((response) => {
        console.log(response.data); // Verifica si "portada" está presente en los datos
        setGameDetails(response.data);
      })
      .catch((error) => console.error("Error al cargar el juego:", error));

    api
      .get("/juego/recomendados")
      .then((response) => setRelatedGames(response.data))
      .catch((error) => {
        console.error("Error al cargar juegos recomendados:", error.response);
      });
  }, [id]);

  if (!gameDetails) {
    return <p>Cargando...</p>; // Mostrar mientras carga la data
  }

  // Verifica que la propiedad portada exista y que sea una URL válida
  const gameImageUrl = gameDetails.portada
    ? `http://localhost:3000${gameDetails.portada}` // Cambia localhost:3000 por la URL de tu backend
    : null;

  return (
    <div className="juego-container">
      <Navbar /> {/* Asegúrate de agregar la Navbar aquí */}
      <div className="juego-details">
        {/* Mostrar la imagen de portada solo si existe */}
        {gameImageUrl && (
          <img
            src={gameImageUrl} // Usar la URL de la portada
            alt={gameDetails.titulo} // Asegúrate de que 'titulo' sea una propiedad válida
            className="juego-portada"
          />
        )}

        <h2 className="juego-title">{gameDetails.titulo}</h2>
        <p className="juego-description">{gameDetails.descripcion}</p>
        <p className="juego-precio">{gameDetails.precio} €</p>

        {/* Botones de acción */}
        <div className="juego-actions">
          <button className="styled-buy-button">Comprar ahora</button>
        </div>
      </div>

      {/* Mostrar juegos recomendados */}
      <div className="related-games">
        <h3>Juegos Relacionados</h3>
        <GameCardList games={relatedGames} />
      </div>
    </div>
  );
}
