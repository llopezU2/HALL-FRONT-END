import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import "./SidebarToggleButton.css"; // Crea un archivo específico si lo deseas

export default function SidebarToggleButton({ onClick }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile) return null;

  return (
    <button className="sidebar-fab" onClick={onClick}>
      <FaBars />
    </button>
  );
}
