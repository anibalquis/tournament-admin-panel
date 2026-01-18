import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// Importar íconos para el Header
import { FaCalendarAlt } from "react-icons/fa";

import "@fontsource/poppins";
import "@fontsource/inter";
import { AuthContext } from "../context/authProvider";
import { useContext, useEffect, useState } from "react";
import { getTotalUsers } from "../service/users";
import { getClubRankings, getCompetitorRankings, getTotalClubs, getTotalTournaments } from "../service";
import { ClubRankings } from "./rankings/Clubs";
import { CompetitorRankings } from "./rankings/Competitors";

const COLORS = ["#7c3aed", "#9333ea", "#c084fc", "#e9d5ff", "#facc15"]; // Datos

const progresoData = [
  { sprint: "Sprint 1", progreso: 100 },
  { sprint: "Sprint 2", progreso: 100 },
  { sprint: "Sprint 3", progreso: 45 },
];

export default function DashboardCards() {
  const { user } = useContext(AuthContext);

  // Totals
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalClubs, setTotalClubs] = useState(0);
  const [totalTournaments, setTotalTournaments] = useState(0);

  // Rankings
  const [clubRankings, setClubRankings] = useState([]);
  const [competitorRankings, setCompetitorRankings] = useState([]);

  const [loadingRankings, setLoadingRankings] = useState(true);
  const [loadingCompetitors, setLoadingCompetitors] = useState(true);

  async function fetchClubRankings() {
    setLoadingRankings(true);

    const { isError, data } = await getClubRankings();

    if (isError) {
      setClubRankings([]);
      setLoadingRankings(false);
      return;
    }

    setClubRankings(data ?? []);
    setLoadingRankings(false);
  }

  async function fetchCompetitorRankings() {
    setLoadingCompetitors(true);
    const { isError, data } = await getCompetitorRankings();

    setCompetitorRankings(isError ? [] : (data ?? []));
    setLoadingCompetitors(false);
  }

  async function fetchTotalUsers() {
    const { isError, total } = await getTotalUsers();
    setTotalUsers(isError ? 0 : total ?? 0);
  }

  async function fetchTotalClubs() {
    const { isError, total } = await getTotalClubs();
    setTotalClubs(isError ? 0 : total ?? 0);
  }

  async function fetchTotalTournaments() {
    const { isError, total } = await getTotalTournaments();
    setTotalTournaments(isError ? 0 : total ?? 0);
  }

  useEffect(() => {
    // Totals
    fetchTotalUsers();
    fetchTotalClubs();
    fetchTotalTournaments();

    // Rankings
    fetchClubRankings();
    fetchCompetitorRankings();
  }, []);

  const smallDate = new Date().toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

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
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-100 p-5 rounded-3xl shadow-[-5px_-5px_10px_#ffffff,5px_5px_10px_#a7a7a7] border border-white"
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-500 font-['Poppins']">
          Panel Principal
        </h1>

        <div className="flex items-center flex-wrap gap-4 md:gap-6">
          {/* INFO DE FECHA Y HORA DE PERÚ (Tiempo Real) */}
          <div className="flex items-center gap-4 bg-white px-5 py-2 rounded-xl shadow-md border border-gray-200">
            <span className="text-xl mr-2">🇵🇪</span> {/* Bandera de Perú */}
            <span className="text-sm font-semibold text-purple-600 flex items-center gap-2">
              <FaCalendarAlt className="text-base" /> {smallDate}
            </span>
          </div>

          {/* 👤 PERFIL DEL USUARIO - MODIFICADO PARA IMAGEN */}
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-purple-100">
            {/* 📸 Contenedor de Imagen de Perfil (w-11 h-11 fijos) */}
            <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {user?.profile_picture ? (
                <img
                  src={user?.profile_picture}
                  alt={`Foto de perfil de ${user?.name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold uppercase">
                  {user?.name?.split("").slice(0, 1).join("")}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900">{user?.name}</h2>
              <p className="text-xs text-purple-500 font-medium">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* FIN TOP BAR MODIFICADO */}
      <div className="space-y-10">
        {/* TARJETAS (Mantenidas en estilo original) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Usuarios"
            value={totalUsers ?? "Cargando..."}
            subtitle="registrados"
            delay={0.15}
          />
          <Card
            title="Clubes"
            value={totalClubs ?? "Cargando..."}
            subtitle="registrados"
            delay={0.2}
          />
          <Card
            title="Torneos"
            value={totalTournaments ?? "Cargando..."}
            subtitle="publicados"
            delay={0.25}
          />
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* RANKIGNS */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-6 flex flex-col grow"
              >
                <h3 className="font-bold mb-4 text-gray-800 text-lg">
                  Ranking de Clubes
                </h3>

                <div className="overflow-x-auto">
                  <ClubRankings
                    clubRankings={clubRankings}
                    loadingRankings={loadingRankings}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-6 flex flex-col grow"
              >
                <h3 className="font-bold mb-4 text-gray-800 text-lg">
                  Ranking de Competidores
                </h3>

                <div className="overflow-x-auto">
                  <CompetitorRankings
                    competitorRankings={competitorRankings}
                    loadingCompetitors={loadingCompetitors}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* AVANCE SPRINT */}
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
      <p className="text-sm text-gray-500">{title}</p>{" "}
      <h2 className="text-4xl font-extrabold text-gray-900">{value}</h2>{" "}
      <p className="text-xs text-purple-600 mt-1 uppercase tracking-wider">
        {subtitle}
      </p>
    </motion.div>
  );
}