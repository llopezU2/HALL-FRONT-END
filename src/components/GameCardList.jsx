import { useEffect, useState } from "react";
import GameCard from "./GameCard";
import api from "../api/axiosConfig";
import "./GameCard.css";

export default function GameCardList() {
  const [juegos, setJuegos] = useState([]);

  useEffect(() => {
    api
      // Llamamos al endpoint que une DB + portadas de RAWG
      .get("/juego/con-portadas")
      .then((res) => {
        // Mapear al shape que espera GameCard
        const lista = res.data.map((juego) => ({
          id: juego.id_juego,
          titulo: juego.titulo,
          descripcion: juego.descripcion,
          precio: juego.precio ?? "N/A", // si no hay precio en tu modelo
          imagen: juego.portada, // la URL que sacamos de RAWG
        }));
        setJuegos(lista);
      })
      .catch((err) => {
        console.error("Error al cargar juegos:", err);
      });
  }, []);

  return (
    <div className="explora-grid">
      {juegos.length > 0 ? (
        juegos.map((juego) => <GameCard key={juego.id} {...juego} />)
      ) : (
        <p className="loading-message">Cargando juegos...</p>
      )}
    </div>
  );
}
