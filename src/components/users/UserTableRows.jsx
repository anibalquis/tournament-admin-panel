import { FiEdit2 } from "react-icons/fi";
import { CheckOrX } from "./CheckOrX";
import { DeleteUser } from "./buttons/DeleteUser";

export const UserTableRows = ({
  users,
  loading,
  handleDelete,
  onEdit,
  searchTerm,
}) => {
  // Mientras carga los datos
  if (loading) {
    return (
      <tr>
        <td colSpan={8} className="p-4 text-center">
          Cargando...
        </td>
      </tr>
    );
  }

  // Si no hay usuarios cargados
  if (!users || users.length === 0) {
    return (
      <tr>
        <td colSpan={8} className="text-center text-gray-500 py-6 italic">
          No se encontraron usuarios.
        </td>
      </tr>
    );
  }

  const filteredUsuarios = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Si el filtro no devuelve resultados
  if (filteredUsuarios.length === 0) {
    return (
      <tr>
        <td colSpan="8" className="text-center text-gray-500 py-6 italic">
          {searchTerm
            ? "No se encontraron usuarios que coincidan con la búsqueda."
            : "No se encontraron usuarios."}
        </td>
      </tr>
    );
  }

  return (
    <>
      {filteredUsuarios?.map((user) => (
        <tr key={user.id} className="border-b hover:bg-indigo-50 transition">
          <td className="p-3 font-medium">{user.id}</td>
          <td className="p-3 font-semibold">{user.name}</td>
          <td className="p-3 hidden md:table-cell">{user.email}</td>
          {/* Administrador */}
          <td className="p-3 text-center">{CheckOrX(user.role, "admin")}</td>
          {/* Competidor */}
          <td className="p-3 text-center">
            {CheckOrX(user.role, "competitor")}
          </td>
          {/* Dueño Club */}
          <td className="p-3 text-center">
            {CheckOrX(user.role, "club_owner")}
          </td>
          {/* Juez */}
          <td className="p-3 text-center">{CheckOrX(user.role, "judge")}</td>
          {/* Acciones */}
          <td className="p-3 text-center space-x-3">
            <button
              onClick={() => onEdit(user)}
              className="text-blue-600 hover:text-blue-800"
              title="Editar Rol"
            >
              <FiEdit2 />
            </button>
            <DeleteUser userId={user.id} onDelete={handleDelete} />
          </td>
        </tr>
      ))}
    </>
  );
};
