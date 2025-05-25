import './Profile.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axiosConfig";
import Modal from "react-modal";
import Swal from 'sweetalert2';

Modal.setAppElement('#root');

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const response = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setNombre(response.data.nombre);
        setEmail(response.data.email);
      } catch {
        setError("Error al cargar el perfil. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const openPasswordModal = () => {
    setPassword("");
    setModalIsOpen(true);
  };

  const handleVerifyPassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = user.id_usuario;

      await api.patch(`/auth/update-name/${userId}`, {
        nombre,
        contraseña: password,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setModalIsOpen(false);
      setEditing(true);
      Swal.fire({
        icon: 'success',
        title: 'Verificación exitosa',
        text: 'Contraseña verificada. Ahora puedes editar tu nombre.',
        confirmButtonColor: '#3b82f6',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Contraseña incorrecta.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = user.id_usuario;

      const response = await api.patch(`/auth/update/${userId}`, {
        nombre
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data.updatedUser);
      setEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'Tu nombre fue actualizado correctamente.',
        confirmButtonColor: '#3b82f6',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el nombre.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="profile-container">
          <div className="profile-box">
            <p className="profile-error">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="profile-container">
          <div className="profile-box">
            <p className="profile-loading">Cargando perfil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-box">
          <h1 className="profile-title">Perfil del Usuario</h1>

          <div className="profile-field">
            <label>Nombre de usuario:</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={!editing}
              className="profile-input"
            />
          </div>

          <div className="profile-field">
            <label>Correo electrónico:</label>
            <input
              value={email}
              disabled
              className="profile-input"
            />
          </div>

          {!editing && (
            <button onClick={openPasswordModal} className="profile-button-edit">
              Editar Perfil
            </button>
          )}

          {editing && (
            <button onClick={handleSaveChanges} className="profile-button-save">
              Guardar Cambios
            </button>
          )}

          <div className="profile-actions">
            <button onClick={handleLogout} className="profile-button-logout">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Modal de verificación de contraseña */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="modal" overlayClassName="modal-overlay">
        <h2>Verificar identidad</h2>
        <p>Introduce tu contraseña para continuar:</p>
        <input
          type="password"
          value={password}
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleVerifyPassword}>Verificar</button>
      </Modal>
    </Layout>
  );
}
