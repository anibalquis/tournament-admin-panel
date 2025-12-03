import { FiUserPlus } from "react-icons/fi";

export const UserHeader = ({ handleOpenModal }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
        Gestión de Usuarios
      </h1>

      <button
        onClick={() => handleOpenModal()}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md font-semibold"
      >
        <FiUserPlus /> Agregar Usuario
      </button>
    </header>
  );
};
