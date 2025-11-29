import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiImage,
  FiX,
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editNoticia, setEditNoticia] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    fecha: "",
    descripcion: "",
    fuente: "",
    imagen: "",
  });

  useEffect(() => {
    setNoticias([
      {
        id: 1,
        titulo: "TechBot gana torneo internacional",
        fecha: "2025-11-05",
        descripcion:
          "El club TechBot se coronó campeón del torneo RoboCup Internacional 2025 celebrado en Lima, Perú.",
        fuente: "Comité Nacional de Robótica",
        imagen: "/img/techbot.jpg",
      },
    ]);
  }, []);

  const filteredNoticias = noticias.filter((n) =>
    n.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (noticia = null) => {
    if (noticia) {
      setEditNoticia(noticia);
      setFormData({ ...noticia });
    } else {
      setEditNoticia(null);
      setFormData({
        titulo: "",
        fecha: "",
        descripcion: "",
        fuente: "",
        imagen: "",
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.titulo.trim() || !formData.descripcion.trim())
      return alert("Completa los campos requeridos.");

    if (editNoticia) {
      setNoticias((prev) =>
        prev.map((n) => (n.id === editNoticia.id ? { ...n, ...formData } : n))
      );
    } else {
      const nueva = { id: noticias.length + 1, ...formData };
      setNoticias([...noticias, nueva]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Deseas eliminar esta noticia?")) {
      setNoticias(noticias.filter((n) => n.id !== id));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imagen: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f7f7fa] font-[Poppins] overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden animate-fadeInUp">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Gestión de Noticias
          </h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow transition-all"
          >
            <FiPlus /> Nueva Noticia
          </button>
        </div>

        {/* Buscador */}
        <div className="relative mb-6 max-w-md w-full">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar noticia..."
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
                <th className="p-3 text-left">Título</th>
                <th className="p-3 hidden md:table-cell">Fecha</th>
                <th className="p-3 hidden lg:table-cell">Fuente</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredNoticias.map((n) => (
                <tr
                  key={n.id}
                  className="border-b hover:bg-indigo-50 transition-colors animate-fadeIn"
                >
                  <td className="p-3 font-medium">{n.id}</td>
                  <td className="p-3 font-semibold flex items-center gap-2">
                    {n.imagen && (
                      <img
                        src={n.imagen}
                        alt="img"
                        className="w-8 h-8 rounded-md object-cover"
                      />
                    )}
                    {n.titulo}
                  </td>
                  <td className="p-3 hidden md:table-cell">{n.fecha}</td>
                  <td className="p-3 hidden lg:table-cell">{n.fuente}</td>
                  <td className="p-3 text-center space-x-3">
                    <button
                      onClick={() => openModal(n)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar Noticia"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar Noticia"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredNoticias.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 py-6 italic"
                  >
                    No se encontraron noticias.
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
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editNoticia ? "Editar Noticia" : "Crear Nueva Noticia"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-600 transition"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Formulario */}
            <form
              className="space-y-4 text-sm pb-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div>
                <label className="block text-gray-600 mb-1">Título</label>
                <input
                  type="text"
                  placeholder="Ej: Ganadores del torneo nacional"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
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
                <label className="block text-gray-600 mb-1">Descripción</label>
                <textarea
                  placeholder="Escribe una breve descripción de la noticia..."
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full h-24 resize-y focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Fuente o Autor</label>
                <input
                  type="text"
                  placeholder="Ej: Universidad Nacional de Ingeniería"
                  value={formData.fuente}
                  onChange={(e) =>
                    setFormData({ ...formData, fuente: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 flex items-center gap-2">
                  <FiImage /> Imagen de la Noticia
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

              <div className="h-4" />
            </form>

            {/* Botones */}
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