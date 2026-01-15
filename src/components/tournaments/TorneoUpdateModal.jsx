import { useState } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import { updateTournament } from "../../service/tournaments";
import { notifySuccess, notifyError } from "../../lib/notify";

export const TorneoUpdateModal = ({ torneo, onClose, onSuccess }) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: torneo.name || "",
    description: torneo.description || "",
    status: torneo.status || "draft",
    combatDurationSec: torneo.combat_duration_sec || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const result = await updateTournament({
      tournamentId: torneo.id,
      name: formData.name,
      description: formData.description,
      status: formData.status,
      combatDurationSec: formData.combatDurationSec
        ? parseInt(formData.combatDurationSec, 10)
        : undefined,
    });

    setSaving(false);

    if (result.isError) {
      notifyError(result.message);
    } else {
      notifySuccess(result.message || "Torneo actualizado correctamente");
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">
            Actualizar Torneo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition p-1"
            aria-label="Cerrar modal"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Nombre del Torneo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
              placeholder="Nombre del torneo"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full h-20 resize-y focus:ring-2 focus:ring-indigo-400"
              placeholder="Descripción del torneo..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            >
              <option value="draft">Pendiente</option>
              <option value="active">Activo</option>
              <option value="finished">Finalizado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          {/* Combat Duration */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Duración del Combate (segundos)
            </label>
            <input
              type="number"
              min="1"
              value={formData.combatDurationSec}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  combatDurationSec: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
              placeholder="Ej: 180"
            />
          </div>

          {/* Hidden submit */}
          <button type="submit" className="hidden" id="update-torneo-submit" />
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 shrink-0 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            onClick={() => document.getElementById("update-torneo-submit")?.click()}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
            disabled={saving}
          >
            {saving && <FiLoader className="animate-spin" size={16} />}
            {saving ? "Guardando..." : "Actualizar"}
          </button>
        </div>
      </div>
    </div>
  );
};
