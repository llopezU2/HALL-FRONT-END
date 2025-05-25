import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "./BibliotecaUsuario.css";
import Navbar from "../../components/Navbar"; // Ajusta la ruta si es necesario

const BibliotecaUsuario = () => {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener usuario logueado
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id_usuario;

  useEffect(() => {
    const fetchBiblioteca = async () => {
      try {
        const res = await api.get(`/biblioteca/${userId}`);
        console.log(res.data); // Verifica la estructura
        setJuegos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setJuegos([]);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchBiblioteca();
  }, [userId]);

  if (!userId) {
    return (
      <div className="biblioteca-usuario-wrapper">
        <h2>Debes iniciar sesión para ver tu biblioteca.</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="biblioteca-usuario-wrapper">
        <h1>Mi Biblioteca</h1>
        {loading ? (
          <div className="biblioteca-loading">Cargando juegos...</div>
        ) : juegos.length === 0 ? (
          <div className="biblioteca-vacia">No tienes juegos en tu biblioteca.</div>
        ) : (
          <div className="biblioteca-cards-container">
            {juegos.map((juego, idx) => (
              <div className="biblioteca-card" key={juego.id_juego || idx}>
                <div className="biblioteca-card-img">
                  {/* Si tienes imagen, usa juego.imagen, si no, un placeholder */}
                  <img
                    src={juego.imagen || "/img/placeholder-game.png"}
                    alt={juego.titulo}
                  />
                </div>
                <div className="biblioteca-card-body">
                  <h2>{juego.titulo}</h2>
                  <p className="biblioteca-card-desc">{juego.descripcion}</p>
                  <div className="biblioteca-card-info">
                    <span>
                      <b>Categoría:</b> {juego.categoria?.nombre || "Sin categoría"}
                    </span>
                    <span>
                      <b>Plataforma:</b> {juego.plataforma?.nombre || "Desconocida"}
                    </span>
                  </div>
                  {/* Puedes mostrar la key si quieres */}
                  {juego.key && (
                    <div className="biblioteca-card-key">
                      <b>Key:</b> {juego.key}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BibliotecaUsuario;