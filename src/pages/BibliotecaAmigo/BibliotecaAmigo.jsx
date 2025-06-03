import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import Layout from "../../components/Layout";
import "./bibliotecaAmigo.css";

export default function BibliotecaAmigo() {
  const { idAmigo } = useParams();
  const [juegos, setJuegos] = useState([]);
  const [amigoNombre, setAmigoNombre] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get(`/biblioteca/amigo/${idAmigo}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setJuegos(res.data))
      .catch((err) => console.error(err));
  }, [idAmigo]);

  useEffect(() => {
    // Si quieres mostrar el nombre del amigo en el encabezado
    const storedAmigos = JSON.parse(localStorage.getItem("amigos")) || [];
    const amigo = storedAmigos.find((a) => a.id_usuario == idAmigo);
    if (amigo) setAmigoNombre(amigo.nombre);
  }, [idAmigo]);

  return (
    <Layout>
      <div className="biblioteca-amigo-wrapper">
        <h1>Biblioteca de {amigoNombre || "tu amigo"}</h1>

        {juegos.length === 0 ? (
          <p>No se encontraron juegos en la biblioteca de este usuario.</p>
        ) : (
          <div className="juegos-grid">
            {juegos.map((juego) => (
              <div className="juego-card" key={juego.id_juego}>
                <img
                  src={juego.portada}
                  alt="Portada"
                  className="juego-portada"
                />
                <h3>{juego.titulo}</h3>
                <p>{juego.descripcion}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
