import { useEffect, useState } from "react";
import GameCard from "./GameCard";
import api from "../api/axiosConfig";
import "./GameCard.css";

export default function GameCardList() {
  const [juegos, setJuegos] = useState([]);

  useEffect(() => {
    api
      .get("/juegos")
      .then((res) => {
        setJuegos(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar juegos:", err);

        // Datos de respaldo estáticos si falla la API
        setJuegos([
          {
            id: 1,
            titulo: "The Witcher 3",
            precio: "29.99",
            descripcion: "Un RPG épico de mundo abierto.",
            imagen:
              "https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg",
          },
          {
            id: 2,
            titulo: "Red Dead Redemption 2",
            precio: "39.99",
            descripcion: "Una historia del viejo oeste impresionante.",
            imagen:
              "https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg",
          },
          {
            id: 3,
            titulo: "Cyberpunk 2077",
            precio: "24.99",
            descripcion: "Explora Night City como un mercenario cibernético.",
            imagen:
              "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg",
          },
        ]);
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
