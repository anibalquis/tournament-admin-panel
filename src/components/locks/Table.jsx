import { FiEdit2 } from "react-icons/fi";

export const Table = ({ filteredBloqueos, getStatusBadge, openModal }) => {
  return (
    <table className="min-w-full text-sm text-gray-700">
      <thead className="bg-indigo-600 text-white text-xs uppercase tracking-wider">
        <tr>
          <th className="p-3 text-left">ID</th>
          <th className="p-3 text-left">Usuario Bloqueado</th>
          <th className="p-3 text-left">Bloqueado Por</th>
          <th className="p-3 text-left">Motivo</th>
          <th className="p-3 text-left">Estado</th>
          <th className="p-3 text-left">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {filteredBloqueos.map((b) => {
          const statusBadge = getStatusBadge(b.status);
          return (
            <tr
              key={b.id}
              className="border-b hover:bg-indigo-50 transition-colors"
            >
              <td className="p-3 font-medium">{b.id}</td>

              <td className="p-3 font-semibold">{b.user?.nickname || "N/A"}</td>

              <td className="p-3 table-cell">
                {b.blockedBy?.nickname || "N/A"}
              </td>

              <td className="p-3 table-cell">
                <span className="line-clamp-1" title={b.reason}>
                  {b.reason || "Sin motivo"}
                </span>
              </td>

              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}
                >
                  {statusBadge.label}
                </span>
              </td>

              <td className="p-3 text-center">
                <button
                  onClick={() => openModal(b)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Editar bloqueo"
                >
                  <FiEdit2 />
                </button>
              </td>
            </tr>
          );
        })}

        {filteredBloqueos.length === 0 && (
          <tr>
            <td colSpan="6" className="text-center text-gray-500 py-6 italic">
              No se encontraron bloqueos de usuarios.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
