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
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [mostrarKeys, setMostrarKeys] = useState(false);

  useEffect(() => {
    const fetchBiblioteca = async () => {
      try {
        const res = await api.get(`/biblioteca/usuario/${userId}`);
        console.log("Juegos con portada:", res.data);
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
          <div className="biblioteca-vacia">
            No tienes juegos en tu biblioteca.
          </div>
        ) : (
          <div className="biblioteca-cards-container">
            {juegos.map((juego, idx) => (
              <div
                className="biblioteca-card"
                key={juego.id_juego || idx}
                onClick={() => {
                  setJuegoSeleccionado(juego);
                  setMostrarModal(true);
                  setMostrarKeys(false);
                  setPasswordInput("");
                  setErrorPassword("");
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="biblioteca-card-img">
                  {/* Si tienes imagen, usa juego.imagen, si no, un placeholder */}
                  <img
                    src={juego.portada || "/img/placeholder-game.png"}
                    alt={juego.titulo}
                  />
                </div>
                <div className="biblioteca-card-body">
                  <h2>{juego.titulo}</h2>
                  <p className="biblioteca-card-desc">{juego.descripcion}</p>
                  <div className="biblioteca-card-info"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{juegoSeleccionado.titulo}</h2>
            <p>Ingresa tu contraseña para ver las keys:</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Contraseña"
            />
            {errorPassword && <div className="error-text">{errorPassword}</div>}
            <div className="modal-buttons">
              <button
                onClick={async () => {
                  try {
                    await api.post("/auth/verificar-password", {
                      contraseña: passwordInput,
                    });
                    setMostrarKeys(true);
                    setErrorPassword("");
                  } catch (error) {
                    setMostrarKeys(false);
                    setErrorPassword("Contraseña incorrecta");
                  }
                }}
              >
                Ver keys
              </button>

              <button onClick={() => setMostrarModal(false)}>Cerrar</button>
            </div>
            {mostrarKeys && (
              <div className="modal-keys">
                <h4>Keys disponibles:</h4>
                <ul className="modal-key-list">
                  {juegoSeleccionado.keys.map((k) => (
                    <li key={k.id_key} className="modal-key-item">
                      <span className="key-text">{k.key}</span>
                      <span className="platform-name">{k.plataforma}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BibliotecaUsuario;
