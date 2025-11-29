import { useState, useEffect } from "react";
import {
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiImage,
  FiX,
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";

// FUENTES MODERNAS
import "@fontsource/poppins";
import "@fontsource/inter";

export default function BloqueosPage() {
  const [bloqueos, setBloqueos] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBloqueo, setEditBloqueo] = useState(null);

  const [formData, setFormData] = useState({
    usuario: "",
    motivo: "",
    fecha: "",
    evidencia: "",
    tipo: "",
  });

  // Datos iniciales ficticios
  useEffect(() => {
    setBloqueos([
      {
        id: 1,
        usuario: "RoboKillerX",
        motivo: "Apodo inapropiado",
        fecha: "2025-11-04",
        tipo: "Moderación",
        evidencia: "/img/apodo_inapropiado.jpg",
      },
      {
        id: 2,
        usuario: "ServoH4ck",
        motivo: "Intento de hackear el firmware del robot rival",
        fecha: "2025-11-07",
        tipo: "Seguridad",
        evidencia: "/img/hack_attempt.jpg",
      },
      {
        id: 3,
        usuario: "TurboSpam99",
        motivo: "Enviar spam de comandos en plena batalla robótica",
        fecha: "2025-11-10",
        tipo: "Abuso del sistema",
        evidencia: "/img/spam_logs.png",
      },
    ]);
  }, []);

  const filteredBloqueos = bloqueos.filter((b) =>
    b.usuario.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (bloqueo = null) => {
    if (bloqueo) {
      setEditBloqueo(bloqueo);
      setFormData({ ...bloqueo });
    } else {
      setEditBloqueo(null);
      setFormData({
        usuario: "",
        motivo: "",
        fecha: "",
        evidencia: "",
        tipo: "",
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.usuario.trim() || !formData.motivo.trim())
      return alert("Debes completar todos los campos requeridos.");

    if (editBloqueo) {
      setBloqueos((prev) =>
        prev.map((b) =>
          b.id === editBloqueo.id ? { ...b, ...formData } : b
        )
      );
    } else {
      const nuevoBloqueo = { id: bloqueos.length + 1, ...formData };
      setBloqueos([...bloqueos, nuevoBloqueo]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Deseas eliminar este bloqueo?")) {
      setBloqueos(bloqueos.filter((b) => b.id !== id));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, evidencia: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f7f7fa] font-[Poppins] overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Gestión de Bloqueos de Usuarios
          </h1>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow transition-all"
          >
            <FiUserPlus /> Registrar Bloqueo
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="relative mb-6 max-w-md w-full">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuario bloqueado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto rounded-xl shadow bg-white border border-gray-100">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-indigo-600 text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Usuario</th>
                <th className="p-3 hidden md:table-cell">Motivo</th>
                <th className="p-3 hidden lg:table-cell">Tipo</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredBloqueos.map((b) => (
                <tr
                  key={b.id}
                  className="border-b hover:bg-indigo-50 transition-colors"
                >
                  <td className="p-3 font-medium">{b.id}</td>

                  <td className="p-3 font-semibold flex items-center gap-2">
                    {b.evidencia && (
                      <img
                        src={b.evidencia}
                        alt="evidencia"
                        className="w-8 h-8 rounded-md object-cover"
                      />
                    )}
                    {b.usuario}
                  </td>

                  <td className="p-3 hidden md:table-cell">{b.motivo}</td>
                  <td className="p-3 hidden lg:table-cell">{b.tipo}</td>

                  <td className="p-3 text-center space-x-3">
                    <button
                      onClick={() => openModal(b)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar bloqueo"
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar bloqueo"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBloqueos.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 py-6 italic"
                  >
                    No se encontraron usuarios bloqueados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-5 sm:p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editBloqueo ? "Editar Bloqueo" : "Registrar Bloqueo"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
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
              <div>
                <label className="block text-gray-600 mb-1">Usuario</label>
                <input
                  type="text"
                  placeholder="Ej: RoboFighter77"
                  value={formData.usuario}
                  onChange={(e) =>
                    setFormData({ ...formData, usuario: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Motivo del bloqueo</label>
                <textarea
                  placeholder="Ej: Uso de apodo ofensivo dentro de la arena robótica"
                  value={formData.motivo}
                  onChange={(e) =>
                    setFormData({ ...formData, motivo: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full h-24 resize-y focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Fecha</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Tipo de infracción</label>
                <input
                  type="text"
                  placeholder="Ej: Seguridad, Moderación, Abuso del sistema"
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 flex items-center gap-2">
                  <FiImage /> Evidencia
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
                {formData.evidencia && (
                  <img
                    src={formData.evidencia}
                    alt="preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg border"
                  />
                )}
              </div>
            </form>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Guardar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
