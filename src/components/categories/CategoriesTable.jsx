import { FiEdit2 } from "react-icons/fi";
import { Button } from "../ui/button";
import { DeleteCategoryButton } from "./DeleteCategoryButton";

export const CategoriesTable = ({
  filteredCategory,
  openModal,
  handleDelete,
}) => {
  return (
    <table className="min-w-full text-sm text-gray-700">
      <thead className="bg-indigo-600 text-white text-xs uppercase tracking-wider">
        <tr className="text-left">
          <th className="p-3">ID</th>
          <th className="p-3">Name</th>
          <th className="p-3">Descripción</th>
          <th className="p-3">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {filteredCategory.map((category) => (
          <tr
            key={category.id}
            className="border-b hover:bg-indigo-50 transition-colors"
          >
            {/* ID */}
            <td className="p-3 font-semibold">{category.id}</td>

            {/* Nombre */}
            <td className="p-3 font-semibold">
              {category.name || "Sin nombre"}
            </td>

            {/* Descripción */}
            <td className="p-3 font-semibold max-w-[250px] truncate">
              {category.description || "Sin descripción"}
            </td>

            {/* Acciones */}
            <td className="p-3 flex flex-wrap gap-x-2.5 gap-y-2">
              <Button
                onClick={() => openModal(category)}
                className="bg-blue-600 hover:bg-blue-600 cursor-pointer"
                title="Editar Usuario"
                size="sm"
              >
                <FiEdit2 />
              </Button>

              <DeleteCategoryButton onDelete={handleDelete} category={category} />
            </td>
          </tr>
        ))}

        {filteredCategory.length === 0 && (
          <tr>
            <td colSpan="7" className="text-center text-gray-500 py-6 italic">
              No se encontraron categorías.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
