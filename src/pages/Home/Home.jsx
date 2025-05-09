import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import GameCardList from "../../components/GameCardList";
import portada from "../../img/GTA VI.png";
import api from "../../api/axiosConfig";
import "./Home.css";


export default function Home() {
  const [promocion, setPromocion] = useState(null);
  const [recomendados, setRecomendados] = useState([]);
  const [modalUsuario, setModalUsuario] = useState(null);

  useEffect(() => {
    const fetchPromocion = async () => {
      try {
        const response = await api.get("/promocion");
        setPromocion(response.data);
      } catch (error) {
        console.error("Error al cargar promoción:", error);
      }
    };

    //recomendados
    const fetchRecomendados = async () => {
      try {
        const response = await api.get("/auth/recomendados");
        setRecomendados(response.data);
      } catch (error) {
        console.error("Error al cargar recomendados:", error);
      }
    };

    fetchPromocion();
    fetchRecomendados();
  }, []);

  const handleAgregarAmigo = async (id_usuario_receptor) => {
    try {
      // Obtener el usuario actual desde el localStorage
      const usuarioActual = JSON.parse(localStorage.getItem("user"));

      // Validar que exista usuario actual
      if (!usuarioActual || !usuarioActual.id_usuario) {
        alert("No se ha iniciado sesión correctamente.");
        return;
      }

      // Enviar solicitud al backend
      await api.post("/solicitud", {
        id_solicitante: usuarioActual.id_usuario,
        id_receptor: id_usuario_receptor,
      });

      alert("Solicitud enviada correctamente");
      setModalUsuario(null);
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      alert("No se pudo enviar la solicitud.");
    }
  };

  return (
    <Layout>
      <div className="home-container">
        <div className="home-hero">
          <img src={portada} alt="Portada" className="hero-image" />
          <div className="hero-overlay">
            <div className="hero-content">
              <div className="promo-box">
                <span className="promo-etiqueta">Reserva</span>
                <span className="promo-fecha">
                  {promocion
                    ? new Date(promocion.fecha_inicio).toLocaleDateString(
                      "es-ES",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )
                    : "14 Julio 2025"}
                </span>
                <h1 className="promo-titulo">
                  {promocion
                    ? `${promocion.regalo_evento.juego.titulo}`
                    : "Título del juego"}
                </h1>
                <p className="promo-descripcion">
                  {promocion
                    ? promocion.regalo_evento.juego.descripcion
                    : "Descripción del juego..."}
                </p>
                <p className="promo-categoria">
                  {promocion
                    ? promocion.regalo_evento.juego.categoria.nombre
                    : "Categoría"}
                </p>
                <div className="promo-precio">
                  <span className="promo-valor">
                    {promocion
                      ? `${promocion.regalo_evento.juego.precio} €`
                      : "75.89€"}
                  </span>
                </div>
                <button className="styled-buy-button">Comprar</button>
              </div>

              <div className="sidebar-box">
                <h3 className="sidebar-title">Usuarios Recomendados</h3>
                <ul className="sidebar-list">
                  {recomendados.length > 0 ? (
                    recomendados.map((user) => (
                      <li key={user.id_usuario} className="recomendado-item">
                        <button
                          className="recomendado-button"
                          onClick={() => {
                            console.log(
                              "ModalUsuario se va a setear con:",
                              user
                            );
                            setModalUsuario(user);
                          }}
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
          <div className="curved-divider"></div>
        </div>

        <div className="home-body">
          <h2 className="section-title">Explora más juegos</h2>
          <GameCardList />
        </div>

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
