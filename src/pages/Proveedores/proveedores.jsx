import React, { useState, useEffect } from "react";
import "./proveedores.css";
import api from "../../api/axiosConfig";
import ErrorPopup from "../../components/ErrorPopup";
import AdminSidebar from "../../components/AdminSidebar";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    contacto: "",
    correo: "",
  });
  const [errors, setErrors] = useState({
    nombre: "",
    contacto: "",
    correo: "",
  });
  const [popupError, setPopupError] = useState(""); // <-- Aquí está el cambio

  // Cargar proveedores al iniciar
  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const res = await api.get("/proveedores");
      setProveedores(res.data);
    } catch {
      setProveedores([]);
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateField = (name, value) => {
    if (!value) return "Este campo es obligatorio.";
    if (name === "correo" && !validateEmail(value)) return "Correo no válido.";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const isFormValid =
    form.nombre &&
    form.contacto &&
    form.correo &&
    !errors.nombre &&
    !errors.contacto &&
    !errors.correo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación final antes de enviar
    const newErrors = {
      nombre: validateField("nombre", form.nombre),
      contacto: validateField("contacto", form.contacto),
      correo: validateField("correo", form.correo),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((err) => err)) return;

    try {
      await api.post("/proveedores", form);
      setForm({ nombre: "", contacto: "", correo: "" });
      setErrors({ nombre: "", contacto: "", correo: "" });
      fetchProveedores();
    } catch {
      setPopupError("Error al agregar proveedor."); // <-- Aquí está el cambio
    }
  };

  return (
    <>
      {popupError && (
        <ErrorPopup message={popupError} onClose={() => setPopupError("")} />
      )}
      <div className="key-wrapper">
        <div className="key-content">
          <aside className="key-sidebar">
            <AdminSidebar />
          </aside>
          <main className="key-panel">
            <h1>Gestión de Proveedores</h1>
            <div className="key-form-filters-row">
              <div className="key-form-section">
                <h2>Agregar Proveedor</h2>
                <form onSubmit={handleSubmit} noValidate>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                  {errors.nombre && (
                    <span className="input-error">{errors.nombre}</span>
                  )}
                  <input
                    type="text"
                    name="contacto"
                    placeholder="Contacto"
                    value={form.contacto}
                    onChange={handleChange}
                    required
                  />
                  {errors.contacto && (
                    <span className="input-error">{errors.contacto}</span>
                  )}
                  <input
                    type="email"
                    name="correo"
                    placeholder="Correo"
                    value={form.correo}
                    onChange={handleChange}
                    required
                  />
                  {errors.correo && (
                    <span className="input-error">{errors.correo}</span>
                  )}
                  <button
                    type="submit"
                    className="key-add-btn"
                    disabled={!isFormValid}
                  >
                    Agregar Proveedor
                  </button>
                </form>
              </div>
            </div>
            <div className="key-list">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Contacto</th>
                    <th>Correo</th>
                  </tr>
                </thead>
                <tbody>
                  {proveedores.map((p) => (
                    <tr key={p.id_proveedor}>
                      <td>{p.nombre}</td>
                      <td>{p.contacto}</td>
                      <td>{p.correo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Proveedores;
