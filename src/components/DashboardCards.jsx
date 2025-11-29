import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
// Importar íconos para el Header
import { FaCalendarAlt, FaClock, FaUserShield } from 'react-icons/fa'; 


import "@fontsource/poppins";
import "@fontsource/inter";

// 🔑 NUEVA LÓGICA: Hook para obtener la hora de Perú en tiempo real (con segundos)
const usePeruTime = () => {
    const [dateTime, setDateTime] = useState({
        date: '',
        time: ''
    });

    useEffect(() => {
        const updateTime = () => {
            // Configurar la zona horaria a Lima, Perú (UTC-5)
            const optionsDate = { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
            };
            // Modificado para incluir segundos: 'second: "2-digit"'
            const optionsTime = { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: true 
            };
            const now = new Date();
            
            setDateTime({
                // Formato: 28 Nov 2025
                date: now.toLocaleDateString('es-PE', optionsDate).replace('.', '').replace(',', ''),
                // Formato: 06:13:11 PM
                time: now.toLocaleTimeString('es-PE', optionsTime)
            });
        };

        updateTime(); // Actualiza inmediatamente
        const intervalId = setInterval(updateTime, 1000); // Actualiza cada segundo

        return () => clearInterval(intervalId); // Limpieza al desmontar
    }, []);

    return dateTime;
};

// 🔑 Placeholder de Imagen de Perfil
// Reemplaza esto con la URL real de tu imagen
const userImagePath = "./src/assets/images/chica.jpg"; 


export default function DashboardCards() {
    const { date, time } = usePeruTime(); // <-- Uso del hook de tiempo real
    
    // Datos de usuario
    const user = {
        name: "Natalia Nicol",
        role: "Admin",
    };
    
    const COLORS = ["#7c3aed", "#9333ea", "#c084fc", "#e9d5ff", "#facc15"];

    // Datos
    const torneosData = [
      { name: "Lucha libre", value: 100 },
      { name: "Sumo", value: 75 },
      { name: "Boxeo", value: 95 },
      { name: "Desafíos", value: 25 },
    ];

    const clubsPie = [
      { name: "Club A", value: 40 },
      { name: "Club B", value: 25 },
      { name: "Club C", value: 20 },
      { name: "Club D", value: 10 },
      { name: "Club E", value: 5 },
    ];

    const rankingData = [
      { id: 1, club: "Robotec Sur", pts: 98 },
      { id: 2, club: "Innovabots Norte", pts: 91 },
      { id: 3, club: "CyberTeam Andes", pts: 87 },
      { id: 4, club: "RobotMasters", pts: 75 },
      { id: 5, club: "TechnoKids", pts: 69 },
      { id: 6, club: "Fenix Robotics", pts: 63 },
      { id: 7, club: "NeoBot Factory", pts: 59 },
      { id: 8, club: "CerebroBot", pts: 54 },
      { id: 9, club: "EagleTech", pts: 49 },
      { id: 10, club: "RoboFuture", pts: 42 },
    ];

    const tareasData = [
      { sprint: "Sprint 1", tareas: 10 },
      { sprint: "Sprint 2", tareas: 15 },
      { sprint: "Sprint 3", tareas: 18 },
    ];

    const progresoData = [
      { sprint: "Sprint 1", progreso: 60 },
      { sprint: "Sprint 2", progreso: 85 },
      { sprint: "Sprint 3", progreso: 100 },
    ];

    const clubsVsOtros = [
      { name: "Club A", value: 40 },
      { name: "Club B", value: 35 },
      { name: "Otros", value: 25 },
    ];


    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-10 px-4 md:px-8 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent font-inter"
        >
            
            {/* 🎯 TOP BAR - MODIFICADO CON ESTILO NEUMÓRFICO Y HORA DE PERÚ */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7 }}
                // Diseño Neumórfico aplicado a la barra superior
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 
                           bg-gray-100 p-5 rounded-3xl 
                           shadow-[-5px_-5px_10px_#ffffff,5px_5px_10px_#a7a7a7] border border-white"
            >
                <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 font-['Poppins']">
                    Panel Principal
                </h1>

                <div className="flex items-center flex-wrap gap-4 md:gap-6">
                    
                    {/* INFO DE FECHA Y HORA DE PERÚ (Tiempo Real) */}
                    <div className="flex items-center gap-4 bg-white px-5 py-2 rounded-xl shadow-md border border-gray-200">
                        <span className="text-xl mr-2">🇵🇪</span> {/* Bandera de Perú */}
                        <span className="text-sm font-semibold text-purple-600 flex items-center gap-2">
                            <FaCalendarAlt className="text-base" /> {date} {/* Fecha de Perú */}
                        </span>
                        {/* Hora en tiempo real con segundos */}
                        <span className="text-sm font-semibold text-blue-600 flex items-center gap-2">
                            <FaClock className="text-base" /> {time} {/* Hora de Perú (incluye segundos) */}
                        </span>
                    </div>

                    {/* 👤 PERFIL DEL USUARIO - MODIFICADO PARA IMAGEN */}
                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-purple-100">
                        
                        {/* 📸 Contenedor de Imagen de Perfil (w-11 h-11 fijos) */}
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {/* Lógica para mostrar la imagen si existe, o el ícono si no existe */}
                            {userImagePath.includes("RUTA_A_TU_IMAGEN") ? (
                                // Ícono de Placeholder (si no hay imagen)
                                <FaUserShield className="w-full h-full p-1.5 text-purple-500" />
                            ) : (
                                // Imagen de perfil cargada
                                <img
                                    src={userImagePath} 
                                    alt={`Foto de perfil de ${user.name}`} 
                                    className="w-full h-full object-cover" // object-cover asegura el relleno completo
                                />
                            )}
                        </div>
                        
                        <div>
                            <h2 className="text-sm font-bold text-gray-900">{user.name}</h2>
                            <p className="text-xs text-purple-500 font-medium">{user.role}</p>
                        </div>
                    </div>
                </div>
            </motion.header>
            {/* FIN TOP BAR MODIFICADO */}
            
            <div className="space-y-10">
                {/* TARJETAS (Mantenidas en estilo original) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card title="Usuarios" value="23,422" subtitle="registrados" delay={0.15} />
                    <Card title="Clubes" value="1,322" subtitle="registrados" delay={0.20} />
                    <Card title="Torneos" value="455" subtitle="publicados" delay={0.25} />
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* IZQUIERDA */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* FILA 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ChartCard title="Tasa de torneos (mensual)" delay={0.3}>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={torneosData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>

                            <ChartCard title="Participación de Clubs" delay={0.35}>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={clubsPie} dataKey="value" outerRadius={90} label>
                                            {clubsPie.map((entry, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>

                        {/* FILA 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ChartCard title="Actividades completadas (Sprint)" delay={0.4}>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={tareasData}>
                                        <XAxis dataKey="sprint" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="tareas"
                                            stroke="#7c3aed"
                                            strokeWidth={3}
                                            dot={{ r: 5 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartCard>

                            <ChartCard title="Clubs vs Otros" delay={0.45}>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={clubsVsOtros}
                                            dataKey="value"
                                            innerRadius={40}
                                            outerRadius={80}
                                            paddingAngle={5}
                                        >
                                            {clubsVsOtros.map((entry, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>
                    </div>

                    {/* DERECHA */}
                    <div className="flex flex-col gap-6">

                        {/* RANKING */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-6 flex flex-col flex-grow"
                        >
                            <h3 className="font-bold mb-4 text-gray-800 text-lg">Ranking de Clubes</h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-gray-700">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="py-2 px-2">#</th>
                                            <th className="py-2 px-2">Club</th>
                                            <th className="py-2 px-2 text-right">Puntaje</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rankingData.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b last:border-none hover:bg-gray-50 transition"
                                            >
                                                <td className="py-2 px-2">{item.id}</td>
                                                <td className="py-2 px-2">{item.club}</td>
                                                <td className="py-2 px-2 text-right font-semibold text-gray-900">
                                                    {item.pts} pts
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        {/* AVANCE */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55, duration: 0.6 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-6"
                        >
                            <h3 className="font-bold mb-3 text-gray-800 text-lg">
                                Avance general del proyecto
                            </h3>

                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={progresoData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                    <XAxis type="number" domain={[0, 100]} />
                                    <YAxis dataKey="sprint" type="category" />
                                    <Tooltip />
                                    <Bar dataKey="progreso" fill="#facc15" radius={5} />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </div>
                </section>
            </div>
        </motion.div>
    );
}

/* Tarjeta individual con animación */
function Card({ title, value, subtitle, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.45 }}
      className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 text-center border border-gray-200 hover:scale-[1.03] transition"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-4xl font-extrabold text-gray-900">{value}</h2>
      <p className="text-xs text-purple-600 mt-1 uppercase tracking-wider">{subtitle}</p>
    </motion.div>
  );
}

/* Tarjeta contenedora de gráficos */
function ChartCard({ title, children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-6 flex flex-col hover:scale-[1.01] transition"
    >
      <h3 className="font-semibold mb-3 text-gray-700">{title}</h3>
      <div className="flex-1 min-h-[200px]">{children}</div>
    </motion.div>
  );
}