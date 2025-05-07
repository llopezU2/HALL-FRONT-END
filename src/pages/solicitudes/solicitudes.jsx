import Layout from "../../components/Layout";
import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig'; // Importa la instancia de Axios configurada
import '../solicitudes/solicitudes.css';

export default function Solicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    const fetchSolicitudes = () => {
        api.get('/solicitudes/recibidas') // Usa la instancia de Axios configurada
            .then(res => setSolicitudes(res.data))
            .catch(err => console.error(err));
    };

    const manejarAccion = (id, accion) => {
        const aceptar = accion === 'aceptar'; // Determina si es aceptar o rechazar
        api.patch(`/solicitud/respond/${id}`, null, { params: { aceptar } }) // Usa la instancia de Axios configurada
            .then(() => fetchSolicitudes())
            .catch(err => console.error(err));
    };

    return (
        <Layout>
            <div className="solicitudes-container">
                <h2>Solicitudes de Amistad Recibidas</h2>
                {solicitudes.length === 0 ? (
                    <p>No hay solicitudes pendientes.</p>
                ) : (
                    <ul>
                        {solicitudes.map((s) => (
                            <li key={s.id_solicitud}>
                                <span>
                                    {s.solicitante.nombre} <br />
                                    <small>{new Date(s.fecha_solicitud).toLocaleDateString()}</small>
                                </span>
                                <div className="acciones">
                                    <button
                                        className="btn-aceptar"
                                        onClick={() => manejarAccion(s.id_solicitud, 'aceptar')}
                                    >
                                        Aceptar
                                    </button>
                                    <button
                                        className="btn-rechazar"
                                        onClick={() => manejarAccion(s.id_solicitud, 'rechazar')}
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    );
}

