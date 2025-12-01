import { useContext, useState } from "react";
import {
  Home,
  Users,
  Trophy,
  Building2,
  Newspaper,
  LogOut,
  Info,
  DoorOpen,
  X,
  ShieldOff,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/images/Logo.png";
import { AuthContext } from "../context/authProvider"

export default function Sidebar() {
  const { logout } = useContext(AuthContext)

  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: <Home />, text: "Inicio", path: "/panel-admin" },
    { icon: <Users />, text: "Roles", path: "/panel-admin/roles" },
    { icon: <Building2 />, text: "Clubes", path: "/panel-admin/clubes" },
    { icon: <Trophy />, text: "Torneos", path: "/panel-admin/torneos" },
    { icon: <Newspaper />, text: "Noticias", path: "/panel-admin/noticias" },
    { icon: <ShieldOff />, text: "Bloqueos", path: "/panel-admin/bloqueos" },
  ];

  return (
    <>
      {/* 🔘 Botón flotante en móvil */}
      <button
        className="lg:hidden fixed bottom-5 left-5 z-50 
          bg-linear-to-r from-blue-600 to-blue-800 
          text-white p-4 rounded-full shadow-lg 
          hover:scale-110 hover:shadow-blue-500/40 
          transition-all duration-300"
        onClick={() => setIsOpen(true)}
      >
        <DoorOpen size={22} />
      </button>

      {/* Fondo oscuro al abrir menú */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🧭 SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-[260px] 
          bg-white rounded-r-3xl shadow-xl p-6 flex flex-col justify-between 
          z-50 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Botón para cerrar menú móvil */}
        <button
          className="lg:hidden absolute top-5 right-5 text-gray-500 hover:text-gray-700"
          onClick={() => setIsOpen(false)}
        >
          <X size={22} />
        </button>

        {/* LOGO */}
        <div>
          <div className="flex items-center gap-2 mb-10">
            <img src={logo} alt="Logo Robotech" className="w-10" />
            <h1 className="font-bold text-gray-800 text-lg">Robotech</h1>
          </div>

          {/* MENU */}
          <nav className="space-y-3">
            {menuItems.map((item) => (
              <MenuItem
                key={item.text}
                icon={item.icon}
                text={item.text}
                active={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
              />
            ))}
          </nav>
        </div>

        {/* SECCIÓN DE INFORMACIÓN */}
        <div className="bg-[#11174a] text-white p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Info size={18} />
            <h2 className="text-sm font-semibold">INFORMACIÓN</h2>
          </div>
          <p className="text-xs text-gray-300">
            Versión del sistema{" "}
            <span className="text-white font-semibold">1.23</span>
          </p>

          {/* BOTÓN CERRAR SESIÓN */}
          <button
            onClick={logout}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}

/* -----------------------------------------
    🟦 COMPONENTE MENU ITEM CON ANIMACIONES
----------------------------------------- */
function MenuItem({ icon, text, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl font-semibold 
        transition-all duration-200 ${
          active
            ? "bg-blue-600 text-white shadow-lg scale-[1.02]"
            : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      {/* Icono con animación */}
      <motion.div
        animate={{
          rotate: active ? 360 : 0,
          scale: active ? 1.2 : 1,
        }}
        transition={{ duration: 0.4 }}
      >
        {icon}
      </motion.div>

      {/* Texto con animación */}
      <motion.span
        animate={{ opacity: active ? 1 : 0.7 }}
        transition={{ duration: 0.25 }}
      >
        {text}
      </motion.span>
    </motion.button>
  );
}
