import { useState, useEffect } from "react";
import {
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiCheck,
  FiX,
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";

// FUENTES
import "@fontsource/poppins";
import "@fontsource/inter";

export default function RolesPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    rol: "Administrador",
  });

  // Cargar usuarios iniciales
  useEffect(() => {
    setUsuarios([
      { id: 1, nombre: "Luis Ramos", correo: "luisr@robot.com", rol: "Administrador" },
      { id: 2, nombre: "María Pérez", correo: "mariap@club.com", rol: "Dueño de club" },
      { id: 3, nombre: "Carlos López", correo: "carlos@competidor.com", rol: "Competidor" },
      { id: 4, nombre: "José Medina", correo: "jose@juez.com", rol: "Juez" },
    ]);
  }, []);

  const filteredUsuarios = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (user = null) => {
    if (user) {
      setEditUser(user);
      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      });
    } else {
      setEditUser(null);
      setFormData({ nombre: "", correo: "", rol: "Administrador" });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.nombre.trim() || !formData.correo.trim())
      return alert("Completa los campos requeridos.");

    if (editUser) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === editUser.id ? { ...u, ...formData } : u))
      );
    } else {
      const nuevo = {
        id: usuarios.length + 1,
        ...formData,
      };
      setUsuarios([...usuarios, nuevo]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar este usuario?")) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  };

  const checkOrX = (rolActual, rolComparar) => {
    return rolActual === rolComparar ? (
      <FiCheck className="text-green-600 text-xl mx-auto" />
    ) : (
      <FiX className="text-gray-300 text-xl mx-auto" />
    );
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f7f7fa] font-[Poppins]">
      <Sidebar />

      {/* ANIMACIÓN DE APARICIÓN */}
      <main className="flex-1 p-6 overflow-x-hidden animate-fadeInUp">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Gestión de Usuarios
          </h1>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md font-semibold"
          >
            <FiUserPlus /> Agregar Usuario
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="relative mb-6 max-w-md w-full">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* TABLA */}
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
              {filteredUsuarios.map((user) => (
                <tr key={user.id} className="border-b hover:bg-indigo-50 transition">
                  <td className="p-3 font-medium">{user.id}</td>
                  <td className="p-3 font-semibold">{user.nombre}</td>
                  <td className="p-3 hidden md:table-cell">{user.correo}</td>

                  <td className="p-3 text-center">
                    {checkOrX(user.rol, "Administrador")}
                  </td>
                  <td className="p-3 text-center">
                    {checkOrX(user.rol, "Competidor")}
                  </td>
                  <td className="p-3 text-center">
                    {checkOrX(user.rol, "Dueño de club")}
                  </td>
                  <td className="p-3 text-center">
                    {checkOrX(user.rol, "Juez")}
                  </td>

                  <td className="p-3 text-center space-x-3">
                    <button
                      onClick={() => openModal(user)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar Rol"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar Usuario"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsuarios.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-gray-500 py-6 italic">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL CON ANIMACIÓN */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border animate-scaleIn">
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

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="email"
                placeholder="Correo electrónico"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
              />

              <div>
                <label className="block text-gray-600 mb-1">Rol del usuario</label>
                <select
                  value={formData.rol}
                  onChange={(e) =>
                    setFormData({ ...formData, rol: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                >
                  <option>Administrador</option>
                  <option>Competidor</option>
                  <option>Dueño de club</option>
                  <option>Juez</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <FiCheck className="inline mr-1" /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
