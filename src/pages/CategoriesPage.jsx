import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { notifySuccess, notifyError, notifyWarning } from "../lib/notify";
import {
  Categories,
  CategoryCreateEditModal,
  Header,
  Search,
} from "../components/categories";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../service";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    const result = await getCategories();

    if (result.isError) {
      setError(result.errorMessage);
      setCategories([]);
    } else {
      setCategories(result.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search input
  const filteredCategory = categories.filter((category) => {
    const searchLower = search.toLowerCase();

    const nombre = category.name?.toLowerCase() || "";

    return nombre.includes(searchLower);
  });

  // Reset form data
  const resetFormData = () => {
    setFormData({ name: "", description: "" });
  };

  // Open modal for create or edit
  const openModal = (category = null) => {
    if (category) {
      setEditCategory(category);
      setFormData({
        name: category.name || "",
        description: category.description || "",
      });
    } else {
      setEditCategory(null);
      resetFormData();
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditCategory(null);
    resetFormData();
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.name.trim()) {
      notifyWarning("El nombre de la categoría es requerido.");
      return false;
    }

    return true;
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    if (editCategory) {
      // Update category
      const result = await updateCategory({
        categoryId: editCategory.id,
        name: formData.name,
        description: formData.description,
      });

      if (result.isError) {
        notifyError(result.errorMessage || "Error al actualizar la categoría.");
      } else {
        notifySuccess(result.message || "Categoría actualizado correctamente.");

        await fetchCategories();

        closeModal();
      }
    } else {
      // Create category
      const result = await createCategory({
        name: formData.name,
        description: formData.description,
      });

      if (result.isError) {
        const errorMsg = result.message || "Error al crear la categoría.";
        notifyError(errorMsg);
      } else {
        notifySuccess(result.message || "Categoría creado correctamente.");

        await fetchCategories();

        closeModal();
      }
    }

    setSaving(false);
  };

  // Handle delete category
  const handleDelete = async (category) => {
    const result = await deleteCategory({ categoryId: category.id });

    if (result.isError) {
      notifyError(result.message || "Error al eliminar la categoría.");
    } else {
      notifySuccess(result.message || "Categoría eliminado correctamente.");

      await fetchCategories();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f7f7fa] font-[Poppins] overflow-hidden">
      <Sidebar />

      <section className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden animate-fadeInUp">
        <Header openModal={openModal} />

        <Search search={search} setSearch={setSearch} />

        <Categories
          loading={loading}
          error={error}
          filteredCategory={filteredCategory}
          handleDelete={handleDelete}
          openModal={openModal}
        />
      </section>

      {showModal && (
        <CategoryCreateEditModal
          editCategory={editCategory}
          closeModal={closeModal}
          formData={formData}
          handleSave={handleSave}
          saving={saving}
          setFormData={setFormData}
        />
      )}
    </div>
  );
}
