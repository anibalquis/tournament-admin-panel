import { FiUsers } from "react-icons/fi";

export const TabClubs = ({ tournamentClubs = [] }) => {
  if (tournamentClubs.length === 0) {
    return <p className="text-gray-500 italic">No hay clubes participantes.</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-2">
        {tournamentClubs.length} club(es) participando
      </p>

      <ul className="space-y-2">
        {tournamentClubs.map(({ club }) => (
          <li
            key={club.id}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <div className="bg-green-100 p-2 rounded-full">
              <FiUsers className="text-green-600" size={18} />
            </div>
            <span className="font-medium text-gray-800">{club.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
