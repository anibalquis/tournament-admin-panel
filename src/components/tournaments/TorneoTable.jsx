import { FiEdit2, FiInfo } from "react-icons/fi";
import { DeleteTorneoButton } from "./DeleteTorneoButton";
import { Button } from "../ui/button";

export const TorneoTable = ({
  filteredTorneos,
  onUpdateClick,
  onDeleteTorneo,
  onDetailClick,
}) => {
  // Helper function to get judge names from tournament
  const getJudgeNames = (judges) => {
    if (!judges || judges.length === 0) return "N/A";
    return judges.map((j) => j.judges?.user?.name || "Sin nombre").join(", ");
  };

  return (
    <table className="min-w-full text-sm text-gray-700">
      <thead className="bg-indigo-600 text-white text-xs uppercase tracking-wider">
        <tr>
          <th className="p-3 text-left">ID</th>
          <th className="p-3 text-left">Nombre</th>
          <th className="p-3 text-left hidden md:table-cell">Descripción</th>
          <th className="p-3 text-left text-nowrap">Máx. Part.</th>
          <th className="p-3 text-left">Estado</th>
          <th className="p-3 text-left">Categoría</th>
          <th className="p-3 text-left">Juez(es)</th>
          <th className="p-3 text-center hidden lg:table-cell">Registrados</th>
          <th className="p-3 text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {filteredTorneos.map((torneo) => (
          <tr
            key={torneo.id}
            className="border-b hover:bg-indigo-50 transition-colors"
          >
            {/* ID */}
            <td className="p-3 font-semibold">{torneo.id}</td>

            {/* Nombre */}
            <td className="p-3 max-w-44 truncate font-semibold">
              {torneo.name || "Sin nombre"}
            </td>

            {/* Descripción */}
            <td className="p-3 hidden md:table-cell max-w-xs truncate">
              {torneo.description || "N/A"}
            </td>

            {/* Máx. Participantes */}
            <td className="p-3 text-center">
              {torneo.max_participants || "N/A"}
            </td>

            {/* Estado */}
            <td className="p-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  torneo.status === "active"
                    ? "bg-green-100 text-green-700"
                    : torneo.status === "finished"
                    ? "bg-gray-200 text-gray-700"
                    : torneo.status === "cancelled"
                    ? "bg-red-500 text-white"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {torneo.status || "Pendiente"}
              </span>
            </td>

            {/* Categoría */}
            <td className="p-3 max-w-36 truncate">
              {torneo.category?.name || "N/A"}
            </td>

            {/* Juez(es) */}
            <td className="p-3 max-w-36 truncate">
              {getJudgeNames(torneo.judges)}
            </td>

            {/* Registrados */}
            <td className="p-3 text-center hidden lg:table-cell">
              {torneo._count?.registrations ?? 0}
            </td>

            {/* Acciones */}
            <td className="p-3">
              <div className="flex flex-col gap-y-2 justify-center">
                <div>
                  <Button
                    onClick={() => onDetailClick(torneo)}
                    className="cursor-pointer"
                    variant="info"
                    title="Más información"
                    size="sm"
                  >
                    <FiInfo />
                    <span>Más info</span>
                  </Button>
                </div>

                <div className="flex justify-between flex-wrap gap-2 max-w-fit">
                  <Button
                    onClick={() => onUpdateClick(torneo)}
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    title="Actualizar Torneo"
                    size="sm"
                  >
                    <FiEdit2 />
                  </Button>

                  <DeleteTorneoButton
                    onDelete={onDeleteTorneo}
                    torneo={torneo}
                  />
                </div>
              </div>
            </td>
          </tr>
        ))}

        {filteredTorneos.length === 0 && (
          <tr>
            <td colSpan="9" className="text-center text-gray-500 py-6 italic">
              No se encontraron torneos.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
