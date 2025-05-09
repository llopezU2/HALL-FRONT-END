// src/components/GameCard.jsx
import { Link } from "react-router-dom";
import "./GameCard.css";

export default function GameCard({ id, titulo, precio, descripcion, imagen }) {
  return (
    <Link to={`/juego/${id}`} className="game-card">
      <img src={imagen} alt={titulo} className="game-card-image" />
      <div className="game-card-content">
        <h3 className="game-card-title">{titulo}</h3>
        <p className="game-card-description">{descripcion}</p>
        <span className="game-card-price">{precio} €</span>
      </div>
    </Link>
  );
}
