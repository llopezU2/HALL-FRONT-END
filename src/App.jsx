import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Perfil/Profile";
import Home from "./pages/Home/Home";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import Juego from "./pages/Juego/Juego";
import ProtectedRoute from "./components/ProtectedRoute";
import Solicitudes from "./pages/solicitudes/solicitudes";
import Categoria from "./pages/categoria/categoria";
import KeyManager from "./pages/Keys/key";
import Proveedores from "./pages/Proveedores/proveedores";
import BibliotecaUsuario from "./pages/BibliotecaUsuario/BibliotecaUsuario";
import SuscripUsuario from "./pages/SuscripUsuario/SuscripUsuario";
import Plataforma from "./pages/Plataforma/Plataforma";
import CompraUsuario from "./pages/CompraUsuario/CompraUsuario";
import Pago from "./pages/Pago/Pago";
import JuegoAgg from "./pages/JuegoAgg/JuegoAgg";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/plataforma/:id_plataforma" element={<Plataforma />} />
        <Route path="/juego/:id" element={<Juego />} />
        <Route path="/compra/:id" element={<CompraUsuario />} />
        <Route path="/pago/:id" element={<Pago />} />

        {/* Rutas protegidas */}
        <Route
          path="/solicitudes"
          element={
            <ProtectedRoute>
              <Solicitudes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/biblioteca-usuario"
          element={
            <ProtectedRoute>
              <BibliotecaUsuario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suscrip-usuario"
          element={
            <ProtectedRoute>
              <SuscripUsuario />
            </ProtectedRoute>
          }
        />

        {/* Rutas admin */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/categorias" element={<Categoria />} />
        <Route path="/admin/key" element={<KeyManager />} />
        <Route path="/admin/proveedores" element={<Proveedores />} />
        <Route path="/admin/juegos" element={<JuegoAgg />} />

        {/* Ruta por defecto: Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
