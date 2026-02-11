import { useState, useEffect } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import { createTournament } from "../../service/tournaments";
import { getCategories } from "../../service/categories";
import { getClubs } from "../../service/clubs";
import { getUsers } from "../../service/users";
import { notifySuccess, notifyError } from "../../lib/notify";

export const TorneoCreateModal = ({ onClose, onSuccess }) => {
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    maxParticipants: 8,
    startDate: "",
    endDate: "",
    judgeId: "",
    combatDurationSec: "",
  });

  // Options for selects
  const [categories, setCategories] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [judges, setJudges] = useState([]);

  // Selected clubs for participants (array of club IDs)
  const [selectedClubs, setSelectedClubs] = useState(Array(8).fill(""));

  // Load categories, clubs, and judges on mount
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      setError(null);

      try {
        const [categoriesRes, clubsRes, usersRes] = await Promise.all([
          getCategories(),
          getClubs(),
          getUsers(),
        ]);

        if (categoriesRes.isError) throw new Error(categoriesRes.errorMessage);
        if (clubsRes.isError) throw new Error(clubsRes.errorMessage);
        if (usersRes.isError) throw new Error(usersRes.errorMessage);

        setCategories(categoriesRes.data || []);
        setClubs(clubsRes.data || []);

        // Filter users to get only judges
        const judgeUsers = (usersRes.data || []).filter(
          (u) => u.role === "judge",
        );
        setJudges(judgeUsers);
      } catch (err) {
        setError(err.message || "Error cargando datos");
      }

      setLoadingData(false);
    };

    loadData();
  }, []);

  // Update selected clubs array when max participants changes
  useEffect(() => {
    setSelectedClubs((prev) => {
      const newLength = formData.maxParticipants;
      if (prev.length < newLength) {
        return [...prev, ...Array(newLength - prev.length).fill("")];
      }
      return prev.slice(0, newLength);
    });
  }, [formData.maxParticipants]);

  // Get available clubs for a slot (excluding already selected)
  const getAvailableClubs = (slotIndex) => {
    const selectedInOtherSlots = selectedClubs
      .filter((_, i) => i !== slotIndex)
      .filter(Boolean);
    return clubs.filter(
      (club) => !selectedInOtherSlots.includes(club.id.toString()),
    );
  };

  // Handle club selection for a slot
  const handleClubSelect = (slotIndex, clubId) => {
    setSelectedClubs((prev) => {
      const updated = [...prev];
      updated[slotIndex] = clubId;
      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Get only selected club IDs (non-empty)
    const allowedClubIds = selectedClubs
      .filter(Boolean)
      .map((id) => parseInt(id, 10));

    const result = await createTournament({
      name: formData.name,
      description: formData.description || undefined,
      categoryId: parseInt(formData.categoryId, 10),
      maxParticipants: formData.maxParticipants,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      judgeId: parseInt(formData.judgeId, 10),
      allowedClubIds,
      combatDurationSec: formData.combatDurationSec
        ? parseInt(formData.combatDurationSec, 10)
        : undefined,
    });

    setSaving(false);

    if (result.isError) {
      notifyError(result.message);
    } else {
      notifySuccess(result.message || "Torneo creado correctamente");
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">
            Crear Nuevo Torneo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition p-1"
            aria-label="Cerrar modal"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loadingData ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-3">
                <FiLoader className="animate-spin text-indigo-600" size={32} />
                <p className="text-gray-600">Cargando datos...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-gray-600 mb-1 text-sm font-medium">
                  Nombre del Torneo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                  placeholder="Ej: RoboCup 2025"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  className="block text-gray-600 mb-1 text-sm font-medium"
                  htmlFor="tournament-description"
                >
                  Descripción
                </label>
                <textarea
                  id="tournament-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full h-20 resize-y focus:ring-2 focus:ring-indigo-400"
                  placeholder="Descripción opcional del torneo..."
                />
              </div>

              {/* Category and Judge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-medium">
                    Categoría *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-medium">
                    Juez *
                  </label>
                  <select
                    required
                    value={formData.judgeId}
                    onChange={(e) =>
                      setFormData({ ...formData, judgeId: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">Seleccionar juez</option>
                    {judges.map((judge) => (
                      <option key={judge.id} value={judge.id}>
                        {judge.name} {judge.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-medium">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-medium">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Max Participants and Combat Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-medium">
                    Número de Participantes *
                  </label>
                  <select
                    required
                    value={formData.maxParticipants}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxParticipants: parseInt(e.target.value, 10),
                      })
                    }
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value={8}>8 participantes</option>
                    <option value={16}>16 participantes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-medium">
                    Duración del Combate (seg)
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
              </div>

              {/* Club Selection */}
              <div>
                <label className="block text-gray-600 mb-2 text-sm font-medium">
                  Seleccionar Clubes Participantes ({formData.maxParticipants}{" "}
                  cupos)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {selectedClubs.map((clubId, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 w-6">
                        {index + 1}.
                      </span>
                      <select
                        value={clubId}
                        onChange={(e) =>
                          handleClubSelect(index, e.target.value)
                        }
                        className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="">Seleccionar club</option>
                        {getAvailableClubs(index).map((club) => (
                          <option key={club.id} value={club.id}>
                            {club.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Cada club solo puede ser seleccionado una vez.
                </p>
              </div>

              {/* Submit button (hidden, form is submitted via footer) */}
              <button
                type="submit"
                className="hidden"
                id="create-torneo-submit"
              />
            </form>
          )}
        </div>

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
            onClick={() =>
              document.getElementById("create-torneo-submit")?.click()
            }
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
            disabled={saving || loadingData}
          >
            {saving && <FiLoader className="animate-spin" size={16} />}
            {saving ? "Guardando..." : "Crear Torneo"}
          </button>
        </div>
      </div>
    </div>
  );
};
