import Silk from '../ui/Silk';
import React, { useState } from "react";
import { FaArrowLeft, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/Logo.png";

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Simulación de envío de correo exitoso
      setMessage("✅ Se ha enviado un enlace de recuperación a tu correo electrónico. ¡Revisa tu bandeja de entrada!");
      
      // En un caso real, después del éxito, podrías redirigir al login
      // navigate("/");
    } else {
      setMessage("⚠️ Por favor, ingresa tu correo electrónico.");
    }
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    navigate("/"); // Navega de vuelta a la ruta raíz (Login)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center font-['Poppins','Martian_Mono'] p-4 overflow-hidden">
      
      {/* FONDO SILK ANIMADO */}
      <div className="absolute inset-0">
        <Silk
          speed={5}
          scale={1}
          color="#7B7481"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* CONTENEDOR DEL FORMULARIO: TRANSPARENTE Y MINIMALISTA */}
      <div className="relative bg-white/5 backdrop-blur-3xl shadow-xl rounded-3xl px-8 py-10 w-full max-w-md text-center transform transition-all duration-300 z-10 border border-white/10">
        
        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img 
            src={logo} 
            alt="Robotech Logo" 
            className="w-16 h-16 drop-shadow-md"
          />
        </div>

        {/* Título */}
        <div className="mb-6">
          <h2 className="text-xl font-extrabold mb-1 text-white flex items-center justify-center gap-2">
            <FaLock className="text-blue-400" /> Recuperar Contraseña
          </h2>
          <p className="text-sm text-white/70 mt-2">
            Ingresa tu correo electrónico para recibir el enlace de restablecimiento.
          </p>
        </div>
        
        {/* Mensaje de estado (éxito/error) */}
        {message && (
          <div className={`p-3 mb-4 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'} transition-all duration-300`}>
            {message}
          </div>
        )}

        {/* FORM */}
        <form className="space-y-6 text-left" onSubmit={handleSubmit}>
          
          {/* EMAIL */}
          <div className="relative w-full group">
            <span className="absolute -left-0.5 top-1 bottom-1 w-1.5 rounded bg-blue-400 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"></span>
            <input
              type="email"
              id="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-white/90 bg-white/10 border border-white/20 rounded-lg shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 placeholder-transparent"
            />
            <label
              htmlFor="email"
              className="absolute left-6 top-3.5 text-sm text-white/50 transition-all duration-200 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400 peer-focus:font-semibold cursor-text"
            >
              <span className="flex items-center gap-1">
                <FaEnvelope className="text-xs" /> Correo Electrónico
              </span>
            </label>
          </div>

          {/* BOTÓN ENVIAR */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center justify-center gap-2 group"
          >
            Enviar Enlace
            <FaArrowRight className="group-hover:translate-x-1 transition-all duration-200" />
          </button>
        </form>

        {/* VOLVER AL LOGIN */}
        <div className="mt-6 text-center">
            <button 
                type="button" // 🔑 Importante: type="button" para evitar enviar el formulario
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-blue-400 transition-colors duration-200"
            >
                <FaArrowLeft className="text-xs" /> Volver al Login
            </button>
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-xs text-white/50">
          <p className="font-light">© 2025 Robotech Security.</p>
        </div>
      </div>
    </div>
  );
}