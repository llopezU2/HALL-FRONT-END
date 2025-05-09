import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import GameCardList from "../../components/GameCardList";
import api from "../../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";

export default function Home() {
  const [recomendados, setRecomendados] = useState([]);
  const [heroGames, setHeroGames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalUsuario, setModalUsuario] = useState(null);

  // Carga inicial de datos
  useEffect(() => {
    api
      .get("/auth/recomendados")
      .then(({ data }) => setRecomendados(data))
      .catch((err) => console.error("Error recomendados:", err));

    api
      .get("/juego/con-portadas")
      .then(({ data }) => setHeroGames(data))
      .catch((err) => console.error("Error heroGames:", err));
  }, []);

  // Ciclo automático de heroGames cada 5 segundos
  useEffect(() => {
    if (!heroGames.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((idx) => (idx + 1) % heroGames.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroGames]);

  const handleAgregarAmigo = async (id_receptor) => {
    try {
      const usr = JSON.parse(localStorage.getItem("user"));
      if (!usr?.id_usuario) return alert("Inicia sesión primero.");
      await api.post("/solicitud", {
        id_solicitante: usr.id_usuario,
        id_receptor,
      });
      alert("Solicitud enviada");
      setModalUsuario(null);
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      alert("No se pudo enviar la solicitud.");
    }
  };

  const heroGame = heroGames[currentIndex];

  return (
    <Layout>
      <div className="home-container">
        {/* HERO */}
        <div className="home-hero">
          <AnimatePresence>
            {heroGame && (
              <motion.img
                key={heroGame.id_juego}
                src={heroGame.portada}
                alt={heroGame.titulo}
                className="hero-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            )}
          </AnimatePresence>

          <div className="hero-overlay">
            <div className="hero-content">
              {/* Promo-box */}
              <div className="promo-box">
                {heroGame && (
                  <>
                    <span className="promo-etiqueta">Destacado</span>
                    {heroGame.released && (
                      <span className="promo-fecha">
                        {new Date(heroGame.released).toLocaleDateString(
                          "es-ES",
                          { day: "2-digit", month: "long", year: "numeric" }
                        )}
                      </span>
                    )}
                    <h1 className="promo-titulo">{heroGame.titulo}</h1>
                    <p className="promo-descripcion">{heroGame.descripcion}</p>
                    <p className="promo-categoria">
                      {heroGame.categoriaNombre}
                    </p>
                    <button className="styled-buy-button">Ver juego</button>
                  </>
                )}
              </div>

              {/* Sidebar de recomendados */}
              <div className="sidebar-box">
                <h3 className="sidebar-title">Usuarios Recomendados</h3>
                <ul className="sidebar-list">
                  {recomendados.length > 0 ? (
                    recomendados.map((user) => (
                      <li key={user.id_usuario} className="recomendado-item">
                        <button
                          className="recomendado-button"
                          onClick={() => setModalUsuario(user)}
                        >
                          {user.nombre}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>No hay usuarios recomendados</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="curved-divider" />
        </div>

        {/* CUERPO: lista de juegos */}
        <div className="home-body">
          <h2 className="section-title">Explora más juegos</h2>
          <GameCardList />
        </div>

        {/* Modal de usuario */}
        {modalUsuario && (
          <div className="modal-overlay" onClick={() => setModalUsuario(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{modalUsuario.nombre}</h2>
              <p>Email: {modalUsuario.email}</p>
              <div className="modal-buttons">
                <button
                  className="btn-add"
                  onClick={() => handleAgregarAmigo(modalUsuario.id_usuario)}
                >
                  Agregar como amigo
                </button>
                <button
                  className="btn-close"
                  onClick={() => setModalUsuario(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
