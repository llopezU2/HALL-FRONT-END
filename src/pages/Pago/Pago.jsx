import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./Pago.css";
import { useState } from "react";
import visaIcon from "../../assets/visa.svg";
import mcIcon from "../../assets/mastercard.svg";
import amexIcon from "../../assets/amex.svg";
import Swal from "sweetalert2";

const CARD_TYPES = [
  {
    name: "visa",
    regex: /^4[0-9]{0,15}$/,
    icon: visaIcon,
    cvv: 3,
    format: "#### #### #### ####",
    label: "Visa",
  },
  {
    name: "mastercard",
    regex: /^(5[1-5][0-9]{0,14}|2[2-7][0-9]{0,14})$/,
    icon: mcIcon,
    cvv: 3,
    format: "#### #### #### ####",
    label: "Mastercard",
  },
  {
    name: "amex",
    regex: /^3[47][0-9]{0,13}$/,
    icon: amexIcon,
    cvv: 3,
    format: "#### ###### #####",
    label: "Amex",
  },
];

function detectCardType(number) {
  const clean = number.replace(/\D/g, "");
  for (const type of CARD_TYPES) {
    if (type.regex.test(clean)) return type;
  }
  return null;
}

export default function Pago() {
  const location = useLocation();
  const navigate = useNavigate();
  const { juego, cantidad, plataforma } = location.state || {};
  const [card, setCard] = useState({
    nombre: "",
    numero: "",
    vencimiento: "",
    cvv: "",
  });
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);

  const cardType = detectCardType(card.numero);

  if (!juego || !plataforma) {
    return <div className="pago-error">No hay información de compra.</div>;
  }

  // Formatea el número según el tipo de tarjeta
  function formatCardNumber(number) {
    const clean = number.replace(/\D/g, "");
    if (!cardType) return clean.replace(/(.{4})/g, "$1 ").trim();
    let result = "";
    let idx = 0;
    for (const char of cardType.format) {
      if (char === "#") {
        if (clean[idx]) result += clean[idx++];
        else break;
      } else {
        result += char;
      }
    }
    return result.trim();
  }

  // Validaciones
  function validate() {
    // Nombre: solo letras y espacios, no vacío
    if (!card.nombre.trim()) return "El nombre es obligatorio.";
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(card.nombre.trim()))
      return "El nombre solo puede contener letras y espacios.";

    // Número: solo números, formato de tarjeta válido
    const cleanNum = card.numero.replace(/\D/g, "");
    if (!cardType) return "Número de tarjeta no válido o no soportado.";
    if (
      (cardType.name === "amex" && cleanNum.length !== 15) ||
      (cardType.name !== "amex" && cleanNum.length !== 16)
    )
      return "Número de tarjeta incompleto.";

    // Fecha: MM/YY, no menor a actual
    if (!/^\d{2}\/\d{2}$/.test(card.vencimiento))
      return "Fecha de vencimiento inválida.";
    const [mm, yy] = card.vencimiento.split("/").map(Number);
    if (mm < 1 || mm > 12) return "Mes de vencimiento inválido.";
    const now = new Date();
    const year = 2000 + yy;
    const expDate = new Date(year, mm);
    if (expDate <= now) return "La tarjeta está vencida.";

    // CVV: solo números, longitud según tipo
    if (!/^\d+$/.test(card.cvv)) return "CVV inválido.";
    if (card.cvv.length !== cardType.cvv)
      return `El CVV debe tener ${cardType.cvv} dígitos.`;

    return "";
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "nombre") {
      // Solo letras y espacios
      setCard({
        ...card,
        nombre: value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, ""),
      });
    } else if (name === "numero") {
      // Solo números, máximo 16 (o 15 para Amex)
      let clean = value.replace(/\D/g, "");
      if (cardType && cardType.name === "amex") clean = clean.slice(0, 15);
      else clean = clean.slice(0, 16);
      setCard({ ...card, numero: clean });
    } else if (name === "vencimiento") {
      // Solo números y /, formato MM/YY
      let val = value.replace(/[^\d/]/g, "");
      if (val.length === 2 && card.vencimiento.length === 1) val += "/";
      setCard({ ...card, vencimiento: val.slice(0, 5) });
    } else if (name === "cvv") {
      // Solo números, longitud según tipo
      let max = cardType ? cardType.cvv : 4;
      setCard({ ...card, cvv: value.replace(/\D/g, "").slice(0, max) });
    }
  };

  const handlePagar = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setProcesando(true);
    setTimeout(() => {
      setProcesando(false);
      Swal.fire({
        title: "¡Pago exitoso!",
        text: "Tu compra se ha procesado correctamente.",
        icon: "success",
        confirmButtonText: "Ir a la biblioteca",
        customClass: {
          confirmButton: "sweet-boton",
        },
      }).then(() => {
        navigate("/biblioteca-usuario");
      });
    }, 1800);
  };

  return (
    <>
      <Navbar />
      <div className="pago-wrapper">
        <div className="pago-preview">
          <img
            src={
              juego.portada ||
              `https://via.placeholder.com/120x120.png?text=${encodeURIComponent(
                juego.titulo || "Juego"
              )}`
            }
            alt={juego.titulo}
            className="pago-portada"
          />
          <div className="pago-info">
            <h2>{juego.titulo}</h2>
            <p>{juego.descripcion}</p>
            <div className="pago-meta">
              <span>
                <b>Plataforma:</b> {plataforma.plataforma?.nombre}
              </span>
              <span>
                <b>Cantidad:</b> {cantidad}
              </span>
              <span>
                <b>Total:</b> $
                {(cantidad * (plataforma.precio_venta || 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <form className="pago-form" onSubmit={handlePagar}>
          <h3>Método de pago</h3>
          <div className="tarjeta-icons">
            {CARD_TYPES.map((type) => (
              <img
                key={type.name}
                src={type.icon}
                alt={type.label}
                className={`tarjeta-icon${
                  cardType && cardType.name === type.name
                    ? " tarjeta-icon-activa"
                    : ""
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
          <div className="tarjeta-form-row">
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
            <div className="tarjeta-inputs">
              <label>
                Nombre en la tarjeta
                <input
                  type="text"
                  name="nombre"
                  value={card.nombre}
                  onChange={handleInput}
                  required
                  autoComplete="cc-name"
                  maxLength={32}
                />
              </label>
              <label>
                Número de tarjeta
                <input
                  type="text"
                  name="numero"
                  value={formatCardNumber(card.numero)}
                  onChange={handleInput}
                  maxLength={cardType && cardType.name === "amex" ? 17 : 19}
                  required
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                />
              </label>
              <div className="pago-form-row">
                <label>
                  Vencimiento (MM/AA)
                  <input
                    type="text"
                    name="vencimiento"
                    value={card.vencimiento}
                    onChange={handleInput}
                    maxLength={5}
                    required
                    autoComplete="cc-exp"
                    placeholder="MM/AA"
                  />
                </label>
                <label>
                  CVV
                  <input
                    type="password"
                    name="cvv"
                    value={card.cvv}
                    onChange={handleInput}
                    maxLength={cardType ? cardType.cvv : 4}
                    required
                    autoComplete="cc-csc"
                    placeholder="123"
                  />
                </label>
              </div>
            </div>
          </div>
          {error && <div className="pago-error">{error}</div>}
          <button className="pago-boton" type="submit" disabled={procesando}>
            {procesando ? "Procesando..." : "Pagar"}
          </button>
        </form>
      </div>
    </>
  );
}
