import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiCheckCircle,
  FiX,
  FiImage,
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";

export default function TorneosPage() {
  const [torneos, setTorneos] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTorneo, setEditTorneo] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    ubicacion: "",
    categoria: "Mini-Sumo",
    minCompetidores: 2,
    maxCompetidores: 16,
    puntosCompetidor: 10,
    puntosClub: 5,
    imagen: "",
    estado: "Pendiente",
    premios: "Medallas",
    informacionExtra: "",
  });

  useEffect(() => {
    setTorneos([
      {
        id: 1,
        nombre: "RoboWar Continental",
        fecha: "2025-12-12",
        ubicacion: "Lima, Perú",
        categoria: "Mini-Sumo",
        minCompetidores: 4,
        maxCompetidores: 32,
        puntosCompetidor: 15,
        puntosClub: 10,
        imagen: "/img/robowar.jpg",
        estado: "Activo",
        premios: "Medallas",
        informacionExtra: "Competencia internacional con jueces invitados.",
      },
    ]);
  }, []);

  const filteredTorneos = torneos.filter((t) =>
    t.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (torneo = null) => {
    if (torneo) {
      setEditTorneo(torneo);
      setFormData({ ...torneo });
    } else {
      setEditTorneo(null);
      setFormData({
        nombre: "",
        fecha: "",
        ubicacion: "",
        categoria: "Mini-Sumo",
        minCompetidores: 2,
        maxCompetidores: 16,
        puntosCompetidor: 10,
        puntosClub: 5,
        imagen: "",
        estado: "Pendiente",
        premios: "Medallas",
        informacionExtra: "",
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.nombre.trim() || !formData.fecha.trim())
      return alert("Completa los campos requeridos.");

    // --- REGLA: Torneos Presenciales / 5 sedes / 5 torneos por día ---

    const fecha = formData.fecha;
    const sede = formData.ubicacion.trim().toLowerCase();

    // Torneos del mismo día
    const torneosMismoDia = torneos.filter(t => t.fecha === fecha);

    // 1. Validar máximo 5 sedes por día
    const sedesPorDia = [
      ...new Set(torneosMismoDia.map(t => t.ubicacion.trim().toLowerCase()))
    ];

    if (!editTorneo) {
      const nuevaSede = !sedesPorDia.includes(sede);
      if (nuevaSede && sedesPorDia.length >= 5) {
        return alert(
          "❌ No puedes registrar más sedes este día. Máximo permitido: 5 sedes por día."
        );
      }
    }

    // 2. Validar máximo 5 torneos por sede en un mismo día
    const torneosEnSede = torneosMismoDia.filter(
      t => t.ubicacion.trim().toLowerCase() === sede
    );

    if (!editTorneo) {
      if (torneosEnSede.length >= 5) {
        return alert(
          "❌ Esta sede ya alcanzó el límite de 5 torneos para este día."
        );
      }
    }

    // ---------------------------------------------------------

    if (editTorneo) {
      setTorneos((prev) =>
        prev.map((t) =>
          t.id === editTorneo.id ? { ...t, ...formData } : t
        )
      );
    } else {
      const nuevo = {
        id: torneos.length + 1,
        ...formData,
      };
      setTorneos([...torneos, nuevo]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Deseas eliminar este torneo?")) {
      setTorneos(torneos.filter((t) => t.id !== id));
    }
  };

  const handleEstado = (id) => {
    setTorneos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              estado:
                t.estado === "Activo"
                  ? "Finalizado"
                  : t.estado === "Finalizado"
                  ? "Pendiente"
                  : "Activo",
            }
          : t
      )
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imagen: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f7f7fa] font-[Poppins] overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden animate-fadeInUp">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            Gestión de Torneos
          </h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow transition-all duration-200"
          >
            <FiPlus /> Nuevo Torneo
          </button>
        </div>

        {/* Buscador */}
        <div className="relative mb-6 max-w-md w-full">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar torneo..."
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
                <th className="p-3 hidden md:table-cell">Categoría</th>
                <th className="p-3 hidden md:table-cell">Ubicación</th>
                <th className="p-3 hidden lg:table-cell">Puntos</th>
                <th className="p-3 hidden lg:table-cell">Competidores</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTorneos.map((t) => (
                <tr
                  key={t.id}
                  className="border-b hover:bg-indigo-50 transition-colors animate-fadeIn"
                >
                  <td className="p-3 font-medium">{t.id}</td>
                  <td className="p-3 font-semibold flex items-center gap-2">
                    {t.imagen && (
                      <img
                        src={t.imagen}
                        alt="img"
                        className="w-8 h-8 rounded-md object-cover"
                      />
                    )}
                    {t.nombre}
                  </td>
                  <td className="p-3 hidden md:table-cell">{t.categoria}</td>
                  <td className="p-3 hidden md:table-cell">{t.ubicacion}</td>
                  <td className="p-3 hidden lg:table-cell">
                    {t.puntosCompetidor}/{t.puntosClub}
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    {t.minCompetidores}-{t.maxCompetidores}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        t.estado === "Activo"
                          ? "bg-green-100 text-green-700"
                          : t.estado === "Finalizado"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.estado}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-3">
                    <button
                      onClick={() => openModal(t)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar Torneo"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleEstado(t.id)}
                      className="text-green-600 hover:text-green-800"
                      title="Cambiar Estado"
                    >
                      <FiCheckCircle />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar Torneo"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTorneos.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center text-gray-500 py-6 italic"
                  >
                    No se encontraron torneos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-5 sm:p-6 animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editTorneo ? "Editar Torneo" : "Registrar Nuevo Torneo"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-600 transition"
                aria-label="Cerrar modal"
              >
                <FiX size={22} />
              </button>
            </div>

            <form className="space-y-4 text-sm pb-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div>
                <label className="block text-gray-600 mb-1">Nombre del Torneo</label>
                <input
                  type="text"
                  placeholder="Ej: RoboCup Perú 2025"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
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
                <label className="block text-gray-600 mb-1">Ubicación</label>
                <select
                  value={formData.ubicacion}
                  onChange={(e) =>
                    setFormData({ ...formData, ubicacion: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Seleccione una sede</option>
                  <option value="Sede Central - Lima">Sede Central - Lima</option>
                  <option value="Sede Norte - Trujillo">Sede Norte - Trujillo</option>
                  <option value="Sede Sur - Arequipa">Sede Sur - Arequipa</option>
                  <option value="Sede Este - Huancayo">Sede Este - Huancayo</option>
                  <option value="Sede Oeste - Callao">Sede Oeste - Callao</option>
                </select>
              </div>


              <div>
                <label className="block text-gray-600 mb-1">Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                >
                  <option>Mini-Sumo</option>
                  <option>SoccerBot</option>
                  <option>Line Follower</option>
                  <option>Megasumo</option>
                  <option>Dron Racing</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-gray-600 mb-1">Mínimo Competidores</label>
                  <input
                    type="number"
                    placeholder="Ej: 4"
                    value={formData.minCompetidores}
                    onChange={(e) =>
                      setFormData({ ...formData, minCompetidores: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-600 mb-1">Máximo Competidores</label>
                  <input
                    type="number"
                    placeholder="Ej: 16"
                    value={formData.maxCompetidores}
                    onChange={(e) =>
                      setFormData({ ...formData, maxCompetidores: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-gray-600 mb-1">Puntos Competidor</label>
                  <input
                    type="number"
                    placeholder="Ej: 10"
                    value={formData.puntosCompetidor}
                    onChange={(e) =>
                      setFormData({ ...formData, puntosCompetidor: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-600 mb-1">Puntos Club</label>
                  <input
                    type="number"
                    placeholder="Ej: 5"
                    value={formData.puntosClub}
                    onChange={(e) =>
                      setFormData({ ...formData, puntosClub: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 mb-1 flex items-center gap-2">
                  <FiImage /> Imagen del Torneo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
                {formData.imagen && (
                  <img
                    src={formData.imagen}
                    alt="preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg border"
                  />
                )}
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Información Extra</label>
                <textarea
                  placeholder="Ej: Torneo patrocinado por TechCorp o contará con jueces internacionales."
                  value={formData.informacionExtra}
                  onChange={(e) =>
                    setFormData({ ...formData, informacionExtra: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full h-20 resize-y focus:ring-2 focus:ring-indigo-400"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Nota breve u observación opcional que aparecerá en la ficha del torneo.
                </p>
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Premio</label>
                <input
                  type="text"
                  value="Medallas"
                  disabled
                  className="border rounded-lg px-3 py-2 w-full bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                >
                  <option>Pendiente</option>
                  <option>Activo</option>
                  <option>Finalizado</option>
                </select>
              </div>

              <div className="h-4" />
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