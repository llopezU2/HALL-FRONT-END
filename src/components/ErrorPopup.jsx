import React from "react";
import "./ErrorPopup.css";

const ErrorPopup = ({ message, onClose }) => (
  <div className="proveedores-popup-backdrop">
    <div className="proveedores-popup">
      <span className="proveedores-popup-close" onClick={onClose}>&times;</span>
      <div className="proveedores-popup-message">{message}</div>
    </div>
  </div>
);

export default ErrorPopup;