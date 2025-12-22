import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiSearch } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import { getNews, createNewsItem, updateNewsItem, deleteNewsItem } from "../service/news";
import { notifySuccess, notifyError } from "../lib/notify";
import { DeleteNewsButton, NewsCreateEditModal } from "../components/news";
import { Button } from "../components/ui/button";

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editNews, setEditNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    source_name: "",
    source_link: "",
    source_logo_url: "",
    categories: "",
  });

  // Fetch news on mount
  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    const result = await getNews();

    if (result.isError) {
      setError(result.errorMessage || "Ocurrió un error al cargar las noticias. Intente nuevamente.");
      setNoticias([]);
    } else {
      setNoticias(result.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Filter news based on search input
  const filteredNoticias = noticias.filter((n) => {
    const searchLower = search.toLowerCase();
    const title = n.title?.toLowerCase() || "";
    const author = n.publishedBy?.nickname?.toLowerCase() || "";
    const categoriesStr = n.categories
      ?.map((c) => c.categories?.name?.toLowerCase() || "")
      .join(" ") || "";

    return (
      title.includes(searchLower) ||
      author.includes(searchLower) ||
      categoriesStr.includes(searchLower)
    );
  });

  // Reset form data
  const resetFormData = () => {
    setFormData({
      title: "",
      content: "",
      image_url: "",
      source_name: "",
      source_link: "",
      source_logo_url: "",
      categories: "",
    });
  };

  // Open modal for create or edit
  const openModal = (news = null) => {
    if (news) {
      setEditNews(news);
      setFormData({
        title: news.title || "",
        content: news.content || "",
        image_url: news.image_url || "",
        source_name: news.source_name || "",
        source_link: news.source_link || "",
        source_logo_url: news.source_logo_url || "",
        categories: news.categories
          ?.map((c) => c.categories?.id)
          .filter(Boolean)
          .join(", ") || "",
      });
    } else {
      setEditNews(null);
      resetFormData();
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditNews(null);
    resetFormData();
  };

  // Handle save (create or update)
  const handleSave = async () => {
    setSaving(true);

    // Parse categories from comma-separated string to array of IDs
    const categoriesArray = formData.categories
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id) && id > 0);

    const payload = {
      title: formData.title,
      content: formData.content,
      image_url: formData.image_url || null,
      source_name: formData.source_name || null,
      source_link: formData.source_link || null,
      source_logo_url: formData.source_logo_url || null,
      categories: categoriesArray.length > 0 ? categoriesArray : [],
    };

    if (editNews) {
      // Update news
      const result = await updateNewsItem(editNews.id, payload);

      if (result.isError) {
        notifyError(result.errorMessage || "Error al actualizar la noticia.");
      } else {
        notifySuccess(result.message || "Noticia actualizada correctamente.");
        closeModal();
        await fetchNews();
      }
    } else {
      // Create news
      const result = await createNewsItem(payload);

      if (result.isError) {
        notifyError(result.errorMessage || "Error al crear la noticia.");
      } else {
        notifySuccess(result.message || "Noticia creada correctamente.");
        closeModal();
        await fetchNews();
      }
    }

    setSaving(false);
  };

  // Handle delete news
  const handleDelete = async (news) => {
    setDeleting(true);

    const result = await deleteNewsItem({ newsID: news.id });

    if (result.isError) {
      notifyError(result.errorMessage || "Error al eliminar la noticia.");
    } else {
      notifySuccess(result.message || "Noticia eliminada correctamente.");
      setNoticias((prev) => prev.filter((n) => n.id !== news.id));
    }

    setDeleting(false);
  };

  // Helper: format categories
  const formatCategories = (categories) => {
    if (!categories || categories.length === 0) return "_";
    const names = categories
      .map((c) => c.categories?.name)
      .filter(Boolean);
    return names.length > 0 ? names.join(", ") : "_";
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
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow transition-all disabled:opacity-50"
          >
            <FiPlus /> Nueva Noticia
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md w-full">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título, autor o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow bg-white border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Cargando noticias...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-12 px-4">
              <p>{error}</p>
              <button
                onClick={fetchNews}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-indigo-600 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Imagen</th>
                  <th className="p-3 text-left">Título</th>
                  <th className="p-3 text-left">Contenido</th>
                  <th className="p-3 text-left">Autor</th>
                  <th className="p-3 text-left">Categorías</th>
                  <th className="p-3 text-left">Fuente</th>
                  <th className="p-3 text-left">Enlace</th>
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
                    <td className="p-3">
                      {n.image_url ? (
                        <img
                          src={n.image_url}
                          alt="img"
                          className="w-10 h-10 rounded-md object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">
                          null
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-semibold max-w-[200px] truncate" title={n.title}>
                      {n.title}
                    </td>
                    <td className="p-3 max-w-[250px]">
                      <span className="line-clamp-1" title={n.content}>
                        {n.content}
                      </span>
                    </td>
                    <td className="p-3">
                      {n.publishedBy?.nickname || "_"}
                    </td>
                    <td className="p-3 max-w-[150px]">
                      <span className="line-clamp-1" title={formatCategories(n.categories)}>
                        {formatCategories(n.categories)}
                      </span>
                    </td>
                    <td className="p-3">
                      {n.source_name || "_"}
                    </td>
                    <td className="p-3">
                      {n.source_link ? (
                        <a
                          href={n.source_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline truncate block max-w-[100px]"
                          title={n.source_link}
                        >
                          Ver enlace
                        </a>
                      ) : (
                        "_"
                      )}
                    </td>
                    <td className="p-3 text-center flex items-center gap-2">
                      <Button
                        onClick={() => openModal(n)}
                        className="bg-blue-600 hover:bg-blue-600"
                        size="sm"
                        title="Editar Noticia"
                      >
                        <FiEdit2 />
                      </Button>
                      <DeleteNewsButton
                        news={n}
                        onDelete={handleDelete}
                        deleting={deleting}
                      />
                    </td>
                  </tr>
                ))}
                {filteredNoticias.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center text-gray-500 py-6 italic"
                    >
                      {search
                        ? "No se encontraron noticias que coincidan con los criterios de búsqueda."
                        : "No hay noticias disponibles."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <NewsCreateEditModal
          editNews={editNews}
          closeModal={closeModal}
          formData={formData}
          setFormData={setFormData}
          saving={saving}
          handleSave={handleSave}
        />
      )}
    </div>
  );
}