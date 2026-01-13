import { FiEdit2 } from "react-icons/fi";
import { Button } from "../ui/button";
import { DeleteRobotButton } from "./DeleteButton";
import { StatusBadge } from "./StatusBadge";

export const RobotsTable = ({ filteredRobot, openModal, handleDelete }) => {
  return (
    <table className="min-w-full text-sm text-gray-700">
      <thead className="bg-indigo-600 text-white text-xs uppercase tracking-wider">
        <tr className="text-left">
          <th className="p-3">ID</th>
          <th className="p-3">Name</th>
          <th className="p-3">Tipo de Control</th>
          <th className="p-3">Ganados</th>
          <th className="p-3">Perdidos</th>
          <th className="p-3">Partidos Jugados</th>
          <th className="p-3">Categoría</th>
          <th className="p-3">Competidor</th>
          <th className="p-3">Estado</th>
          <th className="p-3">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {filteredRobot.map((robot) => (
          <tr
            key={robot.id}
            className="border-b hover:bg-indigo-50 transition-colors"
          >
            {/* ID */}
            <td className="p-3 font-semibold">{robot.id}</td>

            {/* Nombre */}
            <td className="p-3 font-semibold">{robot.name}</td>

            {/* Tipo de control */}
            <td className="p-3 font-semibold">{robot.control_type}</td>

            {/* Ganados */}
            <td className="p-3 text-center font-semibold">{robot.wins}</td>

            {/* Perdidos */}
            <td className="p-3 text-center font-semibold">{robot.losses}</td>

            {/* Partidos jugados */}
            <td className="p-3 text-center font-semibold">
              {robot.matches_played}
            </td>

            {/* Categorías */}
            <td className="p-3 font-semibold">
              {robot.categories.name || "Sin categoría"}
            </td>

            {/* Competidor */}
            <td className="p-3 font-semibold">
              {robot.competitors.user.name || "Sin competidor"}
            </td>

            {/* Estado */}
            <td className="p-3 font-semibold">
              <StatusBadge status={robot.status} />
            </td>

            {/* Acciones */}
            <td className="p-3 flex flex-wrap gap-x-2.5 gap-y-2">
              <Button
                onClick={() => openModal(robot)}
                className="bg-blue-600 hover:bg-blue-600 cursor-pointer"
                title="Editar robot"
                size="sm"
              >
                <FiEdit2 />
              </Button>

              <DeleteRobotButton onDelete={handleDelete} robot={robot} />
            </td>
          </tr>
        ))}

        {filteredRobot.length === 0 && (
          <tr>
            <td colSpan="7" className="text-center text-gray-500 py-6 italic">
              No se encontraron robots.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
