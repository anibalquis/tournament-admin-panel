import { FiX } from "react-icons/fi";

export const ClubCreateEditModal = ({ editClub, closeModal, formData, setFormData, saving, handleSave }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 animate-scaleIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editClub ? "Editar Club" : "Registrar Nuevo Club"}
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
              Nombre del Club *
            </label>
            <input
              type="text"
              placeholder="Nombre del Club"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección Fiscal *
            </label>
            <input
              type="text"
              placeholder="Dirección Fiscal"
              value={formData.fiscal_address}
              onChange={(e) =>
                setFormData({ ...formData, fiscal_address: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo (URL)
            </label>
            <input
              type="text"
              placeholder="https://ejemplo.com/logo.png"
              value={formData.logo}
              onChange={(e) =>
                setFormData({ ...formData, logo: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {!editClub && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID del Propietario *
              </label>
              <input
                type="number"
                placeholder="ID del propietario"
                value={formData.owner_id}
                onChange={(e) =>
                  setFormData({ ...formData, owner_id: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                min="1"
              />
            </div>
          )}

          {editClub && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_approved"
                checked={formData.is_approved}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_approved: e.target.checked,
                  })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_approved"
                className="text-sm font-medium text-gray-700"
              >
                Club Aprobado
              </label>
            </div>
          )}
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
            onClick={handleSave}
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
