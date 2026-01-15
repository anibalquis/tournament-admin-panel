import { useState, useEffect, useCallback } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import { getTournament } from "../../service/tournaments";
import {
  TabCategoria,
  TabJuez,
  TabClubs,
  TabCompetidores,
  TabResultado,
} from "./tabs";

const TABS = [
  { id: "categoria", label: "Categoría" },
  { id: "juez", label: "Juez" },
  { id: "clubs", label: "Clubs" },
  { id: "competidores", label: "Competidores" },
  { id: "resultado", label: "Resultado" },
];

export const TorneoDetailModal = ({ torneoId, onClose }) => {
  const [activeTab, setActiveTab] = useState("categoria");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tournament, setTournament] = useState(null);

  const fetchTournament = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await getTournament({ tournamentID: torneoId });

    if (result.isError) {
      setError(result.errorMessage || "Error al obtener el torneo");
      setTournament(null);
    } else {
      setTournament(result.data);
    }

    setLoading(false);
  }, [torneoId]);

  useEffect(() => {
    if (torneoId) {
      fetchTournament();
    }
  }, [torneoId, fetchTournament]);

  const renderTabContent = () => {
    if (!tournament) return null;

    switch (activeTab) {
      case "categoria":
        return <TabCategoria category={tournament.category} />;
      case "juez":
        return <TabJuez judges={tournament.judges} />;
      case "clubs":
        return <TabClubs tournamentClubs={tournament.tournamentClubs} />;
      case "competidores":
        return <TabCompetidores registrations={tournament.registrations} />;
      case "resultado":
        return (
          <TabResultado
            tournamentId={tournament.id}
            matches={tournament.matches}
            registrations={tournament.registrations}
            tournamentPrizes={tournament.tournament_prizes}
            onTournamentUpdated={fetchTournament}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {loading
                ? "Cargando torneo..."
                : tournament?.name || "Detalle del Torneo"}
            </h2>
            {tournament && (
              <p className="text-sm text-gray-500">
                Estado: {tournament.status} | Max: {tournament.max_participants}{" "}
                participantes
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition p-1"
            aria-label="Cerrar modal"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-gray-200 shrink-0 bg-gray-50">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                  : "text-gray-600 hover:text-indigo-500 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-3">
                <FiLoader className="animate-spin text-indigo-600" size={32} />
                <p className="text-gray-600">Cargando información...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          ) : (
            renderTabContent()
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200 shrink-0 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
