import { FiPlus } from "react-icons/fi";

export const TorneoHeader = ({ onCreateClick }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
        Gestión de Torneos
      </h1>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow transition-all duration-200 cursor-pointer"
      >
        <FiPlus /> Nuevo Torneo
      </button>
    </header>
  );
};
