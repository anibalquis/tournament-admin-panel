import { UserTableRows } from "./UserTableRows";

export const UserTable = ({
  users,
  loading,
  handleDelete,
  searchTerm,
  roleFilter,
  approverFilter,
  openModal,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow bg-white border border-gray-200">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-indigo-600 text-white text-xs uppercase">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Foto</th>
            <th className="p-3 text-left hidden md:table-cell">Nombre</th>
            <th className="p-3 text-left hidden md:table-cell">Apellido</th>
            <th className="p-3 text-left">Nickname</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Rol</th>
            <th className="p-3 text-center">Estado de Aprobación</th>
            <th className="p-3 text-left">Aprobado por</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <UserTableRows
            users={users}
            loading={loading}
            handleDelete={handleDelete}
            onEdit={openModal}
            searchTerm={searchTerm}
            roleFilter={roleFilter}
            approverFilter={approverFilter}
          />
        </tbody>
      </table>
    </div>
  );
};
