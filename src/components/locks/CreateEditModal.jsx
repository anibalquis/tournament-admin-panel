import { FiX } from "react-icons/fi";

export const CreateEditModal = ({
  editBloqueo,
  closeModal,
  handleSave,
  formData,
  setFormData,
  formatDate,
  saving,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editBloqueo ? "Editar Bloqueo" : "Registrar Bloqueo"}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-red-600 transition"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* FORMULARIO */}
        <form
          className="space-y-4 text-sm pb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {!editBloqueo ? (
            // Create form
            <>
              <div>
                <label className="block text-gray-600 mb-1 font-medium">
                  ID del Usuario *
                </label>
                <input
                  type="number"
                  placeholder="Ej: 123"
                  value={formData.user_id}
                  onChange={(e) =>
                    setFormData({ ...formData, user_id: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-medium">
                  Motivo del bloqueo *
                </label>
                <textarea
                  placeholder="Ej: Incumplimiento de las normas del torneo"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full h-24 resize-y focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </>
          ) : (
            // Edit form
            <>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Motivo:</span>{" "}
                  {editBloqueo.reason || "Sin motivo"}
                </p>
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-medium">
                  Estado del bloqueo *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  <option value="">Seleccionar estado</option>
                  <option value="pending">Pendiente</option>
                  <option value="active">Bloqueado</option>
                  <option value="lifted">Desbloqueado</option>
                </select>
              </div>

              {/* Dates section */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Fecha de creación
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(editBloqueo.blocked_at)}
                  </p>
                </div>
                <div className="flex-1 sm:text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Último desbloqueo
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(editBloqueo.unblocked_at)}
                  </p>
                </div>
              </div>
            </>
          )}
        </form>

        <div className="flex justify-end gap-3 mt-4">
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
