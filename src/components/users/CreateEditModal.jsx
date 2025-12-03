import { FiCheck, FiX } from "react-icons/fi";

export const UserCreateEditModal = ({
  editUser,
  setShowModal,
  formData,
  setFormData,
  handleCreate,
  clubs = [],
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border animate-scaleIn max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editUser ? "Editar Rol de Usuario" : "Registrar Nuevo Usuario"}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-red-600"
          >
            <FiX size={22} />
          </button>
        </div>

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
            placeholder="Contraseña *"
            value={formData.user_password}
            onChange={(e) =>
              setFormData({ ...formData, user_password: e.target.value })
            }
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
            required
          />

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
            </select>
          </div>

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
                    {club.nombre}
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
    </div>
  );
};
