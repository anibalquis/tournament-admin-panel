import { FiCheck, FiX } from "react-icons/fi";

export const UserCreateEditModal = ({
  editUser,
  setShowModal,
  formData,
  setFormData,
  handleCreate,
  handleUpdate,
  clubs = [],
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editUser) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  return (
    <article className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border animate-scaleIn max-h-[90vh] overflow-y-auto">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editUser ? "Editar Usuario" : "Registrar Nuevo Usuario"}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-red-600"
          >
            <FiX size={22} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            type="text"
            placeholder="Apellido *"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            type="number"
            placeholder="Edad *"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            required
            min="1"
          />

          <input
            type="text"
            placeholder="Nickname *"
            value={formData.nickname}
            onChange={(e) =>
              setFormData({ ...formData, nickname: e.target.value })
            }
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            type="email"
            placeholder="Correo electrónico *"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            type="password"
            placeholder={editUser ? "Nueva contraseña (opcional)" : "Contraseña *"}
            value={formData.user_password}
            onChange={(e) =>
              setFormData({ ...formData, user_password: e.target.value })
            }
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            required={!editUser}
          />

          {!editUser && (
            <div>
              <label className="block text-gray-600 mb-1">
                Rol del usuario *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                required
              >
                <option value="admin">Administrador</option>
                <option value="competitor">Competidor</option>
                <option value="club_owner">Dueño de club</option>
                <option value="judge">Juez</option>
              </select>
            </div>
          )}

          {/* Campo condicional para Competidor */}
          {formData.role === "competitor" && (
            <div>
              <label className="block text-gray-600 mb-1">Club *</label>
              <select
                value={formData.club_id}
                onChange={(e) =>
                  setFormData({ ...formData, club_id: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                required
              >
                <option value="">Selecciona un club</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Campo condicional para Dueño de club */}
          {formData.role === "club_owner" && (
            <input
              type="text"
              placeholder="DNI *"
              value={formData.dni}
              onChange={(e) =>
                setFormData({ ...formData, dni: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
              required
            />
          )}

          {editUser && formData.role === "club_owner" && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="club_owner_is_approved"
                checked={formData.club_owner_is_approved}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    club_owner_is_approved: e.target.checked,
                  })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="club_owner_is_approved"
                className="text-sm font-medium text-gray-700"
              >
                Dueño de club aprobado
              </label>
            </div>
          )}

          {editUser && formData.role === "competitor" && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="competitor_is_approved"
                checked={formData.competitor_is_approved}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    competitor_is_approved: e.target.checked,
                  })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="competitor_is_approved"
                className="text-sm font-medium text-gray-700"
              >
                Competidor aprobado
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <FiCheck className="inline mr-1" /> Guardar
            </button>
          </div>
        </form>
      </div>
    </article>
  );
};
