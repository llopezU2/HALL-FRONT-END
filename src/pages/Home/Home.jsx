// src/pages/Home.jsx
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import GameCardList from "../../components/GameCardList";
import api from "../../api/axiosConfig";
import "./Home.css";

export default function Home() {
  const [recomendados, setRecomendados] = useState([]);
  const [heroGame, setHeroGame] = useState(null);
  const [modalUsuario, setModalUsuario] = useState(null);

  useEffect(() => {
    // 1) Cargar usuarios recomendados
    api
      .get("/auth/recomendados")
      .then(({ data }) => setRecomendados(data))
      .catch((err) => console.error("Error recomendados:", err));

    // 2) Cargar juegos con portadas y elegir uno al azar
    api
      .get("/juego/con-portadas")
      .then(({ data }) => {
        if (data.length) {
          const aleatorio = data[Math.floor(Math.random() * data.length)];
          setHeroGame(aleatorio);
        }
      })
      .catch((err) => console.error("Error heroGame:", err));
  }, []);

  const handleAgregarAmigo = async (id_receptor) => {
    try {
      const usr = JSON.parse(localStorage.getItem("user"));
      if (!usr?.id_usuario) {
        return alert("Inicia sesión primero.");
      }
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

  return (
    <Layout>
      <div className="home-container">
        {/* HERO */}
        <div className="home-hero">
          {/* Imagen de fondo */}
          {heroGame && (
            <img
              src={heroGame.portada}
              alt={heroGame.titulo}
              className="hero-image"
            />
          )}

          <div className="hero-overlay">
            <div className="hero-content">
              {/* Promo-box con datos del juego aleatorio */}
              <div className="promo-box">
                {heroGame && (
                  <>
                    <span className="promo-etiqueta">Destacado</span>
                    {heroGame.released && (
                      <span className="promo-fecha">
                        {new Date(heroGame.released).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
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

              {/* Sidebar de usuarios recomendados */}
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
