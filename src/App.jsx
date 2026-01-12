import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import LoginPage from "./pages/LoginPage";
import AdminPanel from "./pages/AdminPanel";
import RolesPage from "./pages/RolesPage";
import ClubesPage from "./pages/ClubesPage";
import TorneosPage from "./pages/TorneosPage";
import NoticiasPage from "./pages/NoticiasPage";
import BloqueosPage from "./pages/BloqueosPage";
import RecuperarContrasenaPage from "./pages/RecuperarContrasenaPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { AuthProvider, AuthContext } from "./context/authProvider";
import { Toaster } from "./components/ui/sonner";
import CategoriasPage from "./pages/CategoriesPage";

// Componente de protección de rutas
function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // Verificar si el usuario está autenticado y tiene rol admin
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin";

  // Si no está autenticado o no es admin, redirigir a login
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si pasa las validaciones, renderizar el componente protegido
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/recuperar-contrasena"
            element={<RecuperarContrasenaPage />}
          />
          <Route
            path="/reset-password/:tokenReset"
            element={<ResetPasswordPage />}
          />

          {/* Rutas protegidas - Solo admin autenticado */}
          <Route
            path="/panel-admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/panel-admin/roles"
            element={
              <ProtectedRoute>
                <RolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/panel-admin/clubes"
            element={
              <ProtectedRoute>
                <ClubesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/panel-admin/categorias"
            element={
              <ProtectedRoute>
                <CategoriasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/panel-admin/torneos"
            element={
              <ProtectedRoute>
                <TorneosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/panel-admin/noticias"
            element={
              <ProtectedRoute>
                <NoticiasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/panel-admin/bloqueos"
            element={
              <ProtectedRoute>
                <BloqueosPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}
