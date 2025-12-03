import { UserTableRows } from "./UserTableRows";

export const UserTable = ({
  users,
  loading,
  handleDelete,
  search,
  openModal,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow bg-white border border-gray-200">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-indigo-600 text-white text-xs uppercase">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left hidden md:table-cell">Correo</th>
            <th className="p-3 text-center">Administrador</th>
            <th className="p-3 text-center">Competidor</th>
            <th className="p-3 text-center">Dueño Club</th>
            <th className="p-3 text-center">Juez</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <UserTableRows
            users={users}
            loading={loading}
            handleDelete={handleDelete}
            onEdit={openModal}
            searchTerm={search}
          />
        </tbody>
      </table>
    </div>
  );
};
