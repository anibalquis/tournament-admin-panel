import { FiAlertCircle } from "react-icons/fi";
import { ClubTable } from "./ClubTable";

export const Clubs = ({
  loading,
  error,
  filteredClubes,
  openModal,
  handleDelete,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 bg-white rounded-xl shadow">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 font-medium">Cargando clubes...</p>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow">
        <div className="flex items-start gap-3">
          <FiAlertCircle className="text-red-600 text-2xl shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-semibold text-lg mb-1">
              Error al cargar los clubes
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && !error) {
    return (
      <div className="overflow-x-auto rounded-xl shadow bg-white border border-gray-100">
        <ClubTable
          filteredClubes={filteredClubes}
          openModal={openModal}
          handleDelete={handleDelete}
        />
      </div>
    );
  }
};
