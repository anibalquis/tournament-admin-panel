import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiX,
  FiSearch,
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";

export default function ClubesPage() {
  const [clubes, setClubes] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editClub, setEditClub] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    representante: "",
    correo: "",
    direccion: "",
  });

  useEffect(() => {
    setClubes([
      {
        id: 1,
        nombre: "Robot Masters",
        representante: "Luis Ramos",
        correo: "robotmasters@gmail.com",
        direccion: "Av. Central 123",
        estado: "Pendiente",
        fecha: "2025-11-08",
      },
      {
        id: 2,
        nombre: "TechBots",
        representante: "María Pérez",
        correo: "techbots@gmail.com",
        direccion: "Calle Norte 45",
        estado: "Aprobado",
        fecha: "2025-11-09",
      },
    ]);
  }, []);

  const filteredClubes = clubes.filter((club) =>
    club.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (club = null) => {
    if (club) {
      setEditClub(club);
      setFormData({
        nombre: club.nombre,
        representante: club.representante,
        correo: club.correo,
        direccion: club.direccion,
      });
    } else {
      setEditClub(null);
      setFormData({ nombre: "", representante: "", correo: "", direccion: "" });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.nombre.trim() || !formData.representante.trim())
      return alert("Completa los campos requeridos.");

    if (editClub) {
      setClubes((prev) =>
        prev.map((club) =>
          club.id === editClub.id ? { ...club, ...formData } : club
        )
      );
    } else {
      const nuevoClub = {
        id: clubes.length + 1,
        ...formData,
        estado: "Pendiente",
        fecha: new Date().toISOString().slice(0, 10),
      };
      setClubes([...clubes, nuevoClub]);
    }
    setShowModal(false);
  };

  const handleValidate = (id) => {
    setClubes((prev) =>
      prev.map((club) =>
        club.id === id
          ? {
              ...club,
              estado: club.estado === "Aprobado" ? "Pendiente" : "Aprobado",
            }
          : club
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Deseas eliminar este club?")) {
      setClubes(clubes.filter((club) => club.id !== id));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f7f7fa] font-[Poppins] overflow-hidden">
      <Sidebar />

      {/* Contenido con animación */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden animate-fadeInUp">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            Gestión de Clubes
          </h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow transition-all duration-200"
          >
            <FiPlus /> Agregar Club
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md w-full">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar club..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-xl shadow bg-white border border-gray-100">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-indigo-600 text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left hidden md:table-cell">Representante</th>
                <th className="p-3 text-left hidden lg:table-cell">Correo</th>
                <th className="p-3 text-left hidden lg:table-cell">Dirección</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredClubes.map((club) => (
                <tr
                  key={club.id}
                  className="border-b hover:bg-indigo-50 transition-colors"
                >
                  <td className="p-3 font-medium">{club.id}</td>
                  <td className="p-3 font-semibold">{club.nombre}</td>
                  <td className="p-3 hidden md:table-cell">{club.representante}</td>
                  <td className="p-3 hidden lg:table-cell">{club.correo}</td>
                  <td className="p-3 hidden lg:table-cell">{club.direccion}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        club.estado === "Aprobado"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {club.estado}
                    </span>
                  </td>

                  <td className="p-3 text-center space-x-3">
                    <button
                      onClick={() => openModal(club)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      onClick={() => handleValidate(club.id)}
                      className="text-green-600 hover:text-green-800"
                      title="Validar"
                    >
                      <FiCheckCircle />
                    </button>

                    <button
                      onClick={() => handleDelete(club.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredClubes.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-6 italic">
                    No se encontraron clubes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal con animación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editClub ? "Editar Club" : "Registrar Nuevo Club"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-600 transition"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre del Club"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="text"
                placeholder="Representante"
                value={formData.representante}
                onChange={(e) =>
                  setFormData({ ...formData, representante: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="email"
                placeholder="Correo de contacto"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="text"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
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
