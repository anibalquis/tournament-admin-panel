import { FiSearch } from "react-icons/fi";

export const UserSearch = ({ search, handleSearch }) => {
  return (
    <div className="relative mb-6 max-w-md w-full">
      <FiSearch className="absolute top-3 left-3 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar usuario..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};
