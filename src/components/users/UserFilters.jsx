import { FiSearch, FiFilter } from "react-icons/fi";

export const UserFilters = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleChange,
}) => {
  return (
    <div className="mb-6 flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Buscar usuario
        </label>

        <div className="relative">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Nombre, apellido o nickname..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Role Filter */}
      <div className="min-w-[180px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por rol
        </label>
        <div className="relative">
          <FiFilter className="absolute top-3 left-3 text-gray-400" />
          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white cursor-pointer"
          >
            <option value="">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="club_owner">Dueño del club</option>
            <option value="competitor">Competidor</option>
            <option value="judge">Juez</option>
          </select>
        </div>
      </div>
    </div>
  );
};
