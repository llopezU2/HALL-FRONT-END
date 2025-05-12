import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";
import "./Categoria.css";

export default function Categoria() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);

  // Estados para CRUD de categorías
  const [categories, setCategories] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    fetchCategories();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Funciones para menú móvil
  const toggleFabMenu = () => {
    if (fabMenuOpen) {
      setFabMenuOpen(false);
      setTimeout(() => setShowFabMenu(false), 250);
    } else {
      setShowFabMenu(true);
      setTimeout(() => setFabMenuOpen(true), 10);
    }
  };

  // Obtener categorías
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categoria-juego");
      setCategories(res.data);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      Swal.fire("Error", "No se pudieron cargar las categorías.", "error");
    }
  };

  // Crear / Actualizar categoría
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.patch(`/categoria-juego/${editing.id_categoria_juego}`, {
          nombre,
          descripcion,
        });
        Swal.fire(
          "Actualizado",
          "Categoría actualizada correctamente.",
          "success"
        );
      } else {
        await api.post("/categoria-juego", { nombre, descripcion });
        Swal.fire("Creado", "Categoría creada correctamente.", "success");
      }
      setNombre("");
      setDescripcion("");
      setEditing(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar la categoría.", "error");
    }
  };

  // Iniciar edición de una categoría
  const startEdit = (cat) => {
    setEditing(cat);
    setNombre(cat.nombre);
    setDescripcion(cat.descripcion);
  };

  // Eliminar categoría con confirmación
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar categoría?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/categoria-juego/${id}`);
        Swal.fire("Eliminado", "Categoría eliminada.", "success");
        fetchCategories();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo eliminar la categoría.", "error");
      }
    }
  };

  return (
    <div className="categoria-wrapper">
      <Navbar />
      <div className="categoria-content">
        {sidebarOpen && (
          <aside className="categoria-sidebar">
            <h3>Sección Categorías</h3>
            <ul>
              <li>
                <a href="/admin/suscripciones">Ver Suscripciones</a>
              </li>
              <li>
                <a href="/admin">Volver al Panel</a>
              </li>
            </ul>
          </aside>
        )}

        <main className={`categoria-panel ${!sidebarOpen ? "no-sidebar" : ""}`}>
          <h1>Gestión de Categorías</h1>

          <form className="categoria-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="text"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <button type="submit">
              {editing ? "Actualizar Categoría" : "Crear Categoría"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setNombre("");
                  setDescripcion("");
                }}
              >
                Cancelar
              </button>
            )}
          </form>

          <ul className="categoria-list">
            {categories.map((cat) => (
              <li key={cat.id_categoria_juego} className="categoria-item">
                <div>
                  <strong>{cat.nombre}</strong>
                  <p>{cat.descripcion}</p>
                </div>
                <div className="categoria-actions">
                  <button onClick={() => startEdit(cat)}>Editar</button>
                  <button onClick={() => handleDelete(cat.id_categoria_juego)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>

      {isMobile && (
        <>
          <button className="categoria-fab-toggle" onClick={toggleFabMenu}>
            <FaBars />
          </button>

          {showFabMenu && (
            <div
              className={`categoria-fab-menu-container ${
                fabMenuOpen ? "fade-in" : "fade-out"
              }`}
            >
              <a href="/admin/suscripciones" className="categoria-fab-link">
                Ver Suscripciones
              </a>
              <a href="/admin" className="categoria-fab-link">
                Volver al Panel
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
