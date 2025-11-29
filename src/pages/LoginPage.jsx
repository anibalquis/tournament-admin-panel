import Silk from '../ui/Silk';
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/Logo.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "admin@robotech.com" && password === "12345") {
      navigate("/panel-admin");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault(); 
    navigate("/recuperar-contrasena");
  };

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
        
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-2 group">
            <img 
              src={logo} 
              alt="Robotech Logo" 
              className="w-20 h-20 mb-2 transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
            />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
              <FaShieldAlt className="text-white text-xs" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white/80 tracking-wider">
            ROBOTECH
          </h1>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-white flex items-center justify-center gap-2">
            <FaLock className="text-blue-400" /> Acceso de Administrador
          </h2>
        </div>

        <form className="space-y-6 text-left" onSubmit={handleSubmit}>
          
          <div className="relative w-full group">
            <span
              className="absolute -left-0.5 top-1 bottom-1 w-1.5 rounded bg-blue-400 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"
            ></span>
            <input
              type="email"
              id="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-white/90 bg-white/10 border border-white/20 rounded-lg shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 placeholder-transparent"
            />
            <label
              htmlFor="email"
              className="absolute left-6 top-3.5 text-sm text-white/50 transition-all duration-200 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400 peer-focus:font-semibold cursor-text"
            >
              <span className="flex items-center gap-1">
                <FaUser className="text-xs" /> Email
              </span>
            </label>
          </div>

          <div className="relative w-full group">
            <span
              className="absolute -left-0.5 top-1 bottom-1 w-1.5 rounded bg-blue-400 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"
            ></span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full pl-6 pr-14 pt-6 pb-2 text-sm text-white/90 bg-white/10 border border-white/20 rounded-lg shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 placeholder-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-5 text-white/50 hover:text-blue-400 transition-all duration-200 hover:scale-110"
              >
                {showPassword ? <FaEyeSlash className="text-blue-400" /> : <FaEye className="text-white/50" />}
              </button>
              <label
                htmlFor="password"
                className="absolute left-6 top-3.5 text-sm text-white/50 transition-all duration-200 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400 peer-focus:font-semibold cursor-text"
              >
                <span className="flex items-center gap-1">
                  <FaLock className="text-xs" /> Contraseña
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-blue-400 rounded focus:ring-blue-300 transition-transform duration-200 hover:scale-110 bg-white/10 border-white/30"
              />
              <label htmlFor="remember" className="text-sm text-white/70 hover:text-blue-400 cursor-pointer transition-colors duration-200">
                Recordarme
              </label>
            </div>
            <a 
              href="#" 
              onClick={handleForgotPasswordClick} 
              className="text-sm font-medium text-white/70 hover:text-blue-400 transition-colors duration-200 hover:underline cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center justify-center gap-2 group"
          >
            Ingresar
            <FaArrowRight className="group-hover:translate-x-1 transition-all duration-200" />
          </button>
        </form>

        <div className="mt-8 text-xs text-white/50">
          <p className="font-light">© 2025 Robotech Security. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}