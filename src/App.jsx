import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Perfil/Profile";
import Home from "./pages/Home/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Solicitudes from "./pages/solicitudes/solicitudes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        {/* Ruta por defecto */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
