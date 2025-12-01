import Silk from '../ui/Silk';
import React, { useState } from "react";
import { FaLock, FaArrowLeft, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/images/Logo.png";
import { resetPassword } from '../service/auth';
import { toast } from 'sonner';
import { notifyError, notifySuccess } from '../lib/notify';

export default function ResetPasswordPage() {
  const { tokenReset } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword === "" || confirmPassword === "") {
      notifyError("Por favor, completa ambos campos de contraseña.");
      return;
    }

    if (newPassword !== confirmPassword) {
      notifyError("Las contraseñas no coinciden. Intenta de nuevo.");
      return;
    }

    try {
      const data = await resetPassword({ newPassword, tokenReset });

      if (data.isError) {
        notifyError(data.message);
        return;
      }

      notifySuccess(
        "Contraseña restablecida con éxito.\n¡Redirigiendo al inicio de sesión!",
      );

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch {
      toast.error("Error al conectar con el servidor.", { position: "top-center" });
    }
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    navigate("/");
  }

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  return (
    <div className="relative min-h-screen flex items-center justify-center font-['Poppins','Martian_Mono'] p-4 overflow-hidden">
      
      <div className="absolute inset-0">
        <Silk
          speed={5}
          scale={1}
          color="#7B7481"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      <div className="relative bg-white/5 backdrop-blur-3xl shadow-xl rounded-3xl px-8 py-10 w-full max-w-md text-center transform transition-all duration-300 z-10 border border-white/10">
        
        <div className="flex flex-col items-center mb-6">
          <img 
            src={logo} 
            alt="Robotech Logo" 
            className="w-16 h-16 drop-shadow-md"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-extrabold mb-1 text-white flex items-center justify-center gap-2">
            <FaLock className="text-blue-400" /> Establecer Nueva Contraseña
          </h2>
          <p className="text-sm text-white/70 mt-2">
            Ingresa tu nueva contraseña segura a continuación.
          </p>
        </div>

        <form className="space-y-6 text-left" onSubmit={handleSubmit}>
          
          <div className="relative w-full group">
            <span className="absolute -left-0.5 top-1 bottom-1 w-1.5 rounded bg-blue-400 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"></span>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                placeholder=""
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="peer w-full pl-6 pr-14 pt-6 pb-2 text-sm text-white/90 bg-white/10 border border-white/20 rounded-lg shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 placeholder-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-5 text-white/50 hover:text-blue-400 transition-all duration-200 hover:scale-110"
              >
                {showNewPassword ? <FaEyeSlash className="text-blue-400" /> : <FaEye className="text-white/50" />}
              </button>
              <label
                htmlFor="new-password"
                className="absolute left-6 top-3.5 text-sm text-white/50 transition-all duration-200 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400 peer-focus:font-semibold cursor-text"
              >
                <span className="flex items-center gap-1">
                  <FaLock className="text-xs" /> Nueva Contraseña
                </span>
              </label>
            </div>
          </div>

          <div className="relative w-full group">
            <span className="absolute -left-0.5 top-1 bottom-1 w-1.5 rounded bg-blue-400 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"></span>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                placeholder=""
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="peer w-full pl-6 pr-14 pt-6 pb-2 text-sm text-white/90 bg-white/10 border border-white/20 rounded-lg shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 placeholder-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-5 text-white/50 hover:text-blue-400 transition-all duration-200 hover:scale-110"
              >
                {showConfirmPassword ? <FaEyeSlash className="text-blue-400" /> : <FaEye className="text-white/50" />}
              </button>
              {passwordsMatch && (
                  <FaCheckCircle className="absolute right-10 top-5 text-green-400 text-lg transition-opacity duration-300" />
              )}
              <label
                htmlFor="confirm-password"
                className="absolute left-6 top-3.5 text-sm text-white/50 transition-all duration-200 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400 peer-focus:font-semibold cursor-text"
              >
                <span className="flex items-center gap-1">
                  <FaLock className="text-xs" /> Confirmar Contraseña
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center justify-center gap-2 group"
          >
            Restablecer Contraseña
          </button>
        </form>

        <div className="mt-6 text-center">
            <button 
                type="button"
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-blue-400 transition-colors duration-200"
            >
                <FaArrowLeft className="text-xs" /> Volver al Login
            </button>
        </div>

        <div className="mt-8 text-xs text-white/50">
          <p className="font-light">© 2025 Robotech Security.</p>
        </div>
      </div>
    </div>
  );
}