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

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
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

        {/* Ruta del juego con dinámico ID */}
        <Route
          path="/juego/:id"
          element={
            <ProtectedRoute>
              <Juego />  {/* Vista del juego */}
            </ProtectedRoute>
          }
        />

        {/* Ruta para el Panel de Administración (Admin) */}
        <Route path="/admin" element={<AdminPanel />} />

          {/* Categoria */}
<Route path="/admin/categorias" element={<Categoria />} />

        {/* Ruta por defecto (redirección al login si la URL no existe) */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
