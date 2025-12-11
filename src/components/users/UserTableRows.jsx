import { FiEdit2 } from "react-icons/fi";
import { DeleteUser } from "./buttons/DeleteUser";
import { ApprovalBadge } from "./ApprovalBadge";
import { RoleBadge } from "./RoleBadge";
import { Button } from "../ui/button";

const getApprovalStatus = (user) => {
  if (user.role === "club_owner") {
    return user.club_owner?.is_approved ?? null;
  }
  if (user.role === "competitor") {
    return user.competitor?.is_approved ?? null;
  }
  // El administrador y el juez no tienen estado de aprobación
  return null;
};

const getApproverNickname = (user) => {
  if (user.role === "club_owner") {
    const approver = user.club_owner?.approvedByAdmin;
    if (approver?.nickname) return approver.nickname;
    if (user.club_owner?.is_approved === false) return "Pendiente";
    return "—";
  }

  if (user.role === "competitor") {
    const approver = user.competitor?.approvedBy;
    if (approver?.nickname) return approver.nickname;
    if (user.competitor?.is_approved === false) return "Pendiente";
    return "—";
  }
  // El administrador y el juez no tienen aprobadores
  return "—";
};

export const UserTableRows = ({
  users,
  loading,
  handleDelete,
  onEdit,
  searchTerm = "",
  roleFilter = "",
}) => {
  const colSpan = 10;

  if (loading) {
    return (
      <tr>
        <td colSpan={colSpan} className="p-4 text-center">
          Cargando...
        </td>
      </tr>
    );
  }

  // No hay usuarios cargados
  if (!users || users.length === 0) {
    return (
      <tr>
        <td colSpan={colSpan} className="text-center text-gray-500 py-6 italic">
          No se encontraron usuarios.
        </td>
      </tr>
    );
  }

  const filteredUsuarios = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      user.name?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower);

    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // No results after filtering
  if (filteredUsuarios.length === 0) {
    return (
      <tr>
        <td colSpan={colSpan} className="text-center text-gray-500 py-6 italic">
          {searchTerm || roleFilter
            ? "No se encontraron usuarios que coincidan con los filtros."
            : "No se encontraron usuarios."}
        </td>
      </tr>
    );
  }

  return (
    <>
      {filteredUsuarios.map((user) => {
        const approvalStatus = getApprovalStatus(user);
        const approverNickname = getApproverNickname(user);

        return (
          <tr key={user.id} className="border-b hover:bg-indigo-50 transition">
            {/* ID */}
            <td className="p-3 font-medium">{user.id}</td>

            {/* Foto */}
            <td className="p-3">
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={`Foto de ${user.name}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 uppercase">
                  { user.name.split('').slice(0, 1).join('') }
                </span>
              )}
            </td>

            {/* Nombre */}
            <td className="p-3 font-semibold hidden md:table-cell">{user.name}</td>

            {/* Apellido */}
            <td className="p-3 hidden md:table-cell">{user.lastName || "—"}</td>

            {/* Nickname */}
            <td className="p-3">{user.nickname || "—"}</td>

            {/* Email */}
            <td className="p-3">{user.email}</td>

            {/* Rol */}
            <td className="p-3">
              <RoleBadge role={user.role} />
            </td>

            {/* Estado de Aprobación */}
            <td className="p-3 text-center">
              <ApprovalBadge isApproved={approvalStatus} />
            </td>

            {/* Aprobado por */}
            <td className="p-3">
              <span
                className={`text-sm ${
                  approverNickname === "_" ? "text-gray-400" : "text-gray-700"
                }`}
              >
                {approverNickname}
              </span>
            </td>

            {/* Acciones */}
            <td className="p-3 text-center flex items-center gap-2">
              <Button
                size="sm"
                title="Editar Usuario"
                className="bg-blue-600 hover:bg-blue-600"
                onClick={() => onEdit(user)}
              >
                <FiEdit2 />
              </Button>

              <DeleteUser userId={user.id} onDelete={handleDelete} />
            </td>
          </tr>
        );
      })}
    </>
  );
};
