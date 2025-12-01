import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminPanel from "./pages/AdminPanel";
import RolesPage from "./pages/RolesPage";
import ClubesPage from "./pages/ClubesPage";
import TorneosPage from "./pages/TorneosPage";
import NoticiasPage from "./pages/NoticiasPage";
import BloqueosPage from "./pages/BloqueosPage";
import RecuperarContrasenaPage from "./pages/RecuperarContrasenaPage"; 
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { AuthProvider } from "./context/authProvider";
import { Toaster } from "./components/ui/sonner"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasenaPage />} />
          <Route path="/reset-password/:tokenReset" element={<ResetPasswordPage />} /> 
          <Route path="/panel-admin" element={<AdminPanel />} />
          <Route path="/panel-admin/roles" element={<RolesPage />} />
          <Route path="/panel-admin/clubes" element={<ClubesPage />} />
          <Route path="/panel-admin/torneos" element={<TorneosPage />} />
          <Route path="/panel-admin/noticias" element={<NoticiasPage />} />
          <Route path="/panel-admin/bloqueos" element={<BloqueosPage />} />
        </Routes>
        <Toaster richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}