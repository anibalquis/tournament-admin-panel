import { FiX } from "react-icons/fi";

export const RobotEditModal = ({
  editRobot,
  categories,
  closeModal,
  formData,
  setFormData,
  saving,
  handleEdited,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 animate-scaleIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editRobot ? "Editar Robot" : "Registrar Nuevo Robot"}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-red-600 transition"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              placeholder="Nombre de la categoría"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={saving}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Categoría *</label>
            <select
              value={String(formData.categoryId || "")}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de control *
            </label>

            <select
              value={formData.controlType}
              onChange={(e) =>
                setFormData({ ...formData, controlType: e.target.value })
              }
              disabled={saving}
              required
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Seleccionar tipo de control</option>
              <option value="autonomous">Autónomo</option>
              <option value="remote">Remoto</option>
              <option value="semi_autonomous">Semi autónomo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              disabled={saving}
              required
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Seleccionar el estado</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="disqualified">Descalificada</option>
              <option value="damaged">Dañado</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={closeModal}
            disabled={saving}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleEdited}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};
