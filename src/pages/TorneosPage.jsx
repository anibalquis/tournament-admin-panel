import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getTournaments, deleteTournament } from "../service/tournaments";
import { notifySuccess, notifyError } from "../lib/notify";
import {
  TorneoHeader,
  TorneoSearch,
  Torneos,
  TorneoDetailModal,
  TorneoCreateModal,
  TorneoUpdateModal,
} from "../components/tournaments";

export default function TorneosPage() {
  const [torneos, setTorneos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailTorneoId, setDetailTorneoId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateTorneo, setUpdateTorneo] = useState(null);

  // Fetch tournaments
  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);

    const result = await getTournaments();

    if (result.isError) {
      setError(result.errorMessage || "Error al obtener los torneos");
      setTorneos([]);
    } else {
      setTorneos(result.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  // Filter tournaments based on search input
  const filteredTorneos = torneos.filter((torneo) => {
    const searchLower = search.toLowerCase().trim();
    if (!searchLower) return true;

    // Check tournament name
    const nombre = torneo.name?.toLowerCase() || "";
    if (nombre.includes(searchLower)) return true;

    // Check tournament status
    const estado = torneo.status?.toLowerCase() || "";
    if (estado.includes(searchLower)) return true;

    // Check category name
    const categoria = torneo.category?.name?.toLowerCase() || "";
    if (categoria.includes(searchLower)) return true;

    // Check judges names
    const judges = torneo.judges || [];
    const judgeMatch = judges.some((j) => {
      const judgeName = j.judges?.user?.name?.toLowerCase() || "";
      return judgeName.includes(searchLower);
    });
    if (judgeMatch) return true;

    return false;
  });

  // Handle delete
  const handleDeleteTorneo = async (torneo) => {
    const result = await deleteTournament({ tournamentID: torneo.id });

    if (result.isError) {
      notifyError(result.errorMessage || "Error al eliminar el torneo");
    } else {
      notifySuccess(result.message || "Torneo eliminado correctamente");
      await fetchTournaments();
    }
  };

  // Handle detail click
  const handleDetailClick = (torneo) => {
    setDetailTorneoId(torneo.id);
    setShowDetailModal(true);
  };

  // Handle update click
  const handleUpdateClick = (torneo) => {
    setUpdateTorneo(torneo);
    setShowUpdateModal(true);
  };

  // Handle create click
  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  // Handle modal close and data refresh
  const handleModalSuccess = () => {
    fetchTournaments();
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f7f7fa] font-[Poppins] overflow-hidden">
      <Sidebar />

      <section className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden animate-fadeInUp">
        <TorneoHeader onCreateClick={handleCreateClick} />

        <TorneoSearch search={search} setSearch={setSearch} />

        <Torneos
          loading={loading}
          error={error}
          filteredTorneos={filteredTorneos}
          onUpdateClick={handleUpdateClick}
          onDeleteTorneo={handleDeleteTorneo}
          onDetailClick={handleDetailClick}
        />
      </section>

      {/* Detail Modal */}
      {showDetailModal && detailTorneoId && (
        <TorneoDetailModal
          torneoId={detailTorneoId}
          onClose={() => {
            setShowDetailModal(false);
            setDetailTorneoId(null);
          }}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <TorneoCreateModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Update Modal */}
      {showUpdateModal && updateTorneo && (
        <TorneoUpdateModal
          torneo={updateTorneo}
          onClose={() => {
            setShowUpdateModal(false);
            setUpdateTorneo(null);
          }}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
