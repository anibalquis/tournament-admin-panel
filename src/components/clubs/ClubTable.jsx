import { FiEdit2 } from "react-icons/fi";
import { DeleteClubButton } from "./DeleteClubButton";
import { Button } from "../ui/button";

export const ClubTable = ({ filteredClubes, openModal, handleDelete }) => {
  return (
    <table className="min-w-full text-sm text-gray-700">
      <thead className="bg-indigo-600 text-white text-xs uppercase tracking-wider">
        <tr>
          <th className="p-3 text-left hidden lg:table-cell">ID</th>
          <th className="p-3 text-left">Logo</th>
          <th className="p-3 text-left">Nombre</th>
          <th className="p-3 text-left">Dirección Fiscal</th>
          <th className="p-3 text-left">Propietario</th>
          <th className="p-3 text-left hidden lg:table-cell">
            Email Propietario
          </th>
          <th className="p-3 text-left hidden lg:table-cell">Competidores</th>
          <th className="p-3 text-left">Estado</th>
          <th className="p-3 text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {filteredClubes.map((club) => (
          <tr
            key={club.id}
            className="border-b hover:bg-indigo-50 transition-colors"
          >
            {/* ID */}
            <td className="p-3 font-semibold hidden lg:table-cell">
              {club.id}
            </td>

            {/* Logo */}
            <td className="p-3">
              {club.logo ? (
                <img
                  src={club.logo}
                  alt={`Logo de ${club.name}`}
                  className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <span className="text-xs text-gray-500">null</span>
              )}
            </td>

            {/* Nombre */}
            <td className="p-3 font-semibold">{club.name || "Sin nombre"}</td>

            {/* Dirección Fiscal */}
            <td className="p-3">{club.fiscal_address || "N/A"}</td>

            {/* Propietario */}
            <td className="p-3">{club.owner?.nickname || "N/A"}</td>

            {/* Email Propietario */}
            <td className="p-3 hidden lg:table-cell">
              {club.owner?.email || "N/A"}
            </td>

            {/* Competidores */}
            <td className="p-3 hidden lg:table-cell">
              {club.competitors?.length
                ? club.competitors.map((c) => (
                    <span key={c.user.nickname} className="block">
                      {c.user.nickname}
                    </span>
                  ))
                : "N/A"}
            </td>

            {/* Estado */}
            <td className="p-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  club.is_approved
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {club.is_approved ? "Aprobado" : "Pendiente"}
              </span>
            </td>

            {/* Acciones */}
            <td className="p-3 flex flex-wrap gap-x-2.5 gap-y-2">
              <Button
                onClick={() => openModal(club)}
                className="bg-blue-600 hover:bg-blue-600 cursor-pointer"
                title="Editar Usuario"
                size="sm"
              >
                <FiEdit2 />
              </Button>

              <DeleteClubButton onDelete={handleDelete} club={club} />
            </td>
          </tr>
        ))}

        {filteredClubes.length === 0 && (
          <tr>
            <td colSpan="7" className="text-center text-gray-500 py-6 italic">
              No se encontraron clubes.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
