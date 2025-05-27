import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import Modal from "react-modal";
import visaIcon from "../../assets/visa.svg";
import mcIcon from "../../assets/mastercard.svg";
import amexIcon from "../../assets/amex.svg";
import Swal from "sweetalert2";

import "./HallPlus.css";

// ✅ SOLO ESTA LÍNEA ES NECESARIA
Modal.setAppElement("#root");

const CARD_TYPES = [
  {
    name: "visa",
    regex: /^4[0-9]{0,15}$/,
    icon: visaIcon,
    cvv: 3,
    format: "#### #### #### ####",
  },
  {
    name: "mastercard",
    regex: /^(5[1-5][0-9]{0,14}|2[2-7][0-9]{0,14})$/,
    icon: mcIcon,
    cvv: 3,
    format: "#### #### #### ####",
  },
  {
    name: "amex",
    regex: /^3[47][0-9]{0,13}$/,
    icon: amexIcon,
    cvv: 4,
    format: "#### ###### #####",
  },
];

function detectCardType(number) {
  const clean = number.replace(/\D/g, "");
  return CARD_TYPES.find((type) => type.regex.test(clean)) || null;
}

export default function HallPlus() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id_usuario;

  const [planes, setPlanes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [card, setCard] = useState({
    nombre: "",
    numero: "",
    vencimiento: "",
    cvv: "",
  });
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState({});
  const cardType = detectCardType(card.numero);

  useEffect(() => {
    api
      .get("/suscripcion/tipos")
      .then((res) => setPlanes(res.data))
      .catch((err) => console.error("Error al cargar planes", err));
  }, []);

  const formatCardNumber = (number) => {
    const clean = number.replace(/\D/g, "");
    if (!cardType) return clean.replace(/(.{4})/g, "$1 ").trim();
    let result = "",
      idx = 0;
    for (const char of cardType.format) {
      result += char === "#" ? clean[idx++] || "" : char;
    }
    return result.trim();
  };

  const validateCard = () => {
    if (!card.nombre.trim()) return "El nombre es obligatorio.";
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(card.nombre))
      return "Nombre inválido.";
    const cleanNum = card.numero.replace(/\D/g, "");
    if (!cardType) return "Tarjeta no válida.";
    if (
      (cardType.name === "amex" && cleanNum.length !== 15) ||
      (cardType.name !== "amex" && cleanNum.length !== 16)
    )
      return "Número de tarjeta incompleto.";
    if (!/^\d{2}\/\d{2}$/.test(card.vencimiento)) return "Fecha inválida.";
    const [mm, yy] = card.vencimiento.split("/").map(Number);
    const exp = new Date(2000 + yy, mm);
    if (exp <= new Date()) return "La tarjeta está vencida.";
    if (!/^\d+$/.test(card.cvv) || card.cvv.length !== cardType.cvv)
      return `CVV debe tener ${cardType.cvv} dígitos.`;
    return "";
  };

  const handlePagar = async () => {
    const err = validateCard();
    if (err) return setError(err);
    setError("");
    setProcesando(true);

    try {
      const res = await api.post("/suscripcion/suscribirse", {
        id_usuario: userId,
        id_tipo_suscripcion: selectedPlan.id_tipo_suscripcion,
      });

      if (res.data.result?.yaSuscrito) {
        Swal.fire({
          icon: "info",
          title: "Ya estás suscrito",
          text:
            res.data.result.mensaje ||
            "Actualmente tienes una suscripción activa.",
          confirmButtonColor: "#3b82f6",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Suscripción exitosa",
          text: "Te has suscrito correctamente al plan HALL+.",
          confirmButtonColor: "#3b82f6",
        });
      }
    } catch (e) {
      setMensaje("Error al suscribirse.");
    } finally {
      setProcesando(false);
      setModalOpen(false);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "nombre") {
      setCard({
        ...card,
        nombre: value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, ""),
      });
    } else if (name === "numero") {
      let clean = value.replace(/\D/g, "");
      clean =
        cardType?.name === "amex" ? clean.slice(0, 15) : clean.slice(0, 16);
      setCard({ ...card, numero: clean });
    } else if (name === "vencimiento") {
      let val = value.replace(/[^\d/]/g, "");
      if (val.length === 2 && card.vencimiento.length === 1) val += "/";
      setCard({ ...card, vencimiento: val.slice(0, 5) });
    } else if (name === "cvv") {
      let max = cardType?.cvv || 4;
      setCard({ ...card, cvv: value.replace(/\D/g, "").slice(0, max) });
    }
  };

  const getJuegosDelPlan = () => {
    if (!selectedPlan) return [];
    // Orden de jerarquía: Deluxe > Premium > Plus
    const jerarquia = ["Deluxe", "Premium", "Plus"];
    const idx = jerarquia.findIndex((j) =>
      selectedPlan.nombre?.toLowerCase().includes(j.toLowerCase())
    );
    if (idx === -1) return [selectedPlan.juegoActual].filter(Boolean);

    // Incluye juegos de todos los planes de igual o menor jerarquía
    return planes
      .filter((p) => {
        const planIdx = jerarquia.findIndex((j) =>
          p.nombre?.toLowerCase().includes(j.toLowerCase())
        );
        return planIdx >= idx && p.juegoActual;
      })
      .map((p) => p.juegoActual);
  };

  return (
    <>
      <Navbar />
      <div className="hallplus-wrapper">
        <h1 className="hallplus-title">Elige tu plan HALL+</h1>
        {mensaje && <p className="mensaje-suscripcion">{mensaje}</p>}
        <div className="hallplus-plans">
          {planes.map((plan) => (
            <div className="plan-card" key={plan.id_tipo_suscripcion}>
              {plan.juegoActual?.portada && (
                <img
                  src={plan.juegoActual.portada}
                  alt="Portada del juego"
                  className="plan-portada"
                />
              )}
              <h2>{plan.nombre}</h2>
              <p className="price">${plan.precio} / semana</p>
              {plan.juegoActual ? (
                <div className="juego-info">
                  <p>
                    <strong>Juego:</strong> {plan.juegoActual.titulo}
                  </p>
                  <p className="descripcion-juego">
                    {plan.juegoActual.descripcion}
                  </p>
                </div>
              ) : (
                <p>No hay juego asignado aún.</p>
              )}
              <button
                onClick={() => {
                  setSelectedPlan(plan);
                  setModalOpen(true);
                }}
              >
                Suscribirme
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="pago-container">
          <h2>Método de pago</h2>
          <div className="tarjeta-icons">
            {CARD_TYPES.map((type) => (
              <img
                key={type.name}
                src={type.icon}
                alt={type.name}
                className={`tarjeta-icon ${
                  cardType?.name === type.name ? "tarjeta-icon-activa" : ""
                }`}
                style={{
                  filter:
                    !cardType || cardType.name === type.name
                      ? "none"
                      : "grayscale(1) opacity(0.5)",
                }}
              />
            ))}
          </div>

          <div className="pago-content">
            <div
              className="tarjeta-preview"
              style={{
                background:
                  cardType?.name === "visa"
                    ? "linear-gradient(135deg, #2563eb, #1d4ed8)" // Azul Visa
                    : cardType?.name === "mastercard"
                    ? "linear-gradient(135deg, #f97316, #ea580c)" // Naranja Mastercard
                    : cardType?.name === "amex"
                    ? "linear-gradient(135deg, #0ea5e9, #38bdf8)" // Celeste Amex
                    : "linear-gradient(135deg, #38bdf8 60%, #0ea5e9 100%)", // Default
              }}
            >
              <div className="tarjeta-chip"></div>
              <div className="tarjeta-numero">
                {formatCardNumber(card.numero) || "•••• •••• •••• ••••"}
              </div>
              <div className="tarjeta-info-row">
                <div>
                  <span className="tarjeta-label">Nombre</span>
                  <span className="tarjeta-nombre">
                    {card.nombre || "NOMBRE Y APELLIDO"}
                  </span>
                </div>
                <div>
                  <span className="tarjeta-label">Vence</span>
                  <span className="tarjeta-vencimiento">
                    {card.vencimiento || "MM/AA"}
                  </span>
                </div>
                <div>
                  <span className="tarjeta-label">CVV</span>
                  <span className="tarjeta-cvv">
                    {card.cvv ? "•••" : "•••"}
                  </span>
                </div>
              </div>
            </div>

            <div className="formulario-tarjeta">
              <label>Nombre en la tarjeta</label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={card.nombre}
                onChange={handleInput}
              />

              <label>Número de tarjeta</label>
              <input
                type="text"
                name="numero"
                placeholder="1234 5678 9012 3456"
                value={formatCardNumber(card.numero)}
                onChange={handleInput}
              />

              <div className="fila">
                <div>
                  <label>Vencimiento (MM/AA)</label>
                  <input
                    type="text"
                    name="vencimiento"
                    placeholder="MM/AA"
                    value={card.vencimiento}
                    onChange={handleInput}
                  />
                </div>
                <div>
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={card.cvv}
                    onChange={handleInput}
                  />
                </div>
              </div>

              {error && <p className="pago-error">{error}</p>}

              <button
                className="btn-pagar"
                onClick={handlePagar}
                disabled={procesando}
              >
                {procesando ? "Procesando..." : "Pagar"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
