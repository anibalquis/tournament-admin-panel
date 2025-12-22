import { FiX, FiImage } from "react-icons/fi";

export const NewsCreateEditModal = ({
  editNews,
  closeModal,
  formData,
  setFormData,
  saving,
  handleSave,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-100 animate-scaleIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editNews ? "Editar Noticia" : "Crear Nueva Noticia"}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-red-600 transition"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Title - required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              placeholder="Título de la noticia"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={saving}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
            />
          </div>

          {/* Content - required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido *
            </label>
            <textarea
              placeholder="Contenido de la noticia..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              disabled={saving}
              className="border rounded-lg px-3 py-2 w-full h-32 resize-y focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
            />
          </div>

          {/* Image URL - optional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiImage /> URL de Imagen (opcional)
            </label>
            <input
              type="text"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              disabled={saving}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
            />
            {formData.image_url && (
              <img
                src={formData.image_url}
                alt="preview"
                className="mt-2 w-full h-32 object-cover rounded-lg border"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>

          {/* Two columns for source fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source Name - optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la fuente (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej: CNN, BBC, etc."
                value={formData.source_name}
                onChange={(e) =>
                  setFormData({ ...formData, source_name: e.target.value })
                }
                disabled={saving}
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
              />
            </div>

            {/* Source Link - optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enlace de la fuente (opcional)
              </label>
              <input
                type="text"
                placeholder="https://ejemplo.com/articulo"
                value={formData.source_link}
                onChange={(e) =>
                  setFormData({ ...formData, source_link: e.target.value })
                }
                disabled={saving}
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Source Logo URL - optional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL del logo de la fuente (opcional)
            </label>
            <input
              type="text"
              placeholder="https://ejemplo.com/logo.png"
              value={formData.source_logo_url}
              onChange={(e) =>
                setFormData({ ...formData, source_logo_url: e.target.value })
              }
              disabled={saving}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
            />
          </div>

          {/* Categories - optional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categorías (opcional, IDs separados por coma)
            </label>
            <input
              type="text"
              placeholder="Ej: 1, 2, 3"
              value={formData.categories}
              onChange={(e) =>
                setFormData({ ...formData, categories: e.target.value })
              }
              disabled={saving}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ingrese los IDs de categorías separados por coma
            </p>
          </div>
        </div>

        {/* Footer with timestamps for edit mode */}
        {editNews && (
          <div className="flex justify-between text-xs text-gray-500 mt-4 pt-4 border-t">
            <span>Creado: {formatDate(editNews.created_at)}</span>
            <span>Actualizado: {formatDate(editNews.updated_at)}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
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
