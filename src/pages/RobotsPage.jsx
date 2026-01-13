import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { notifySuccess, notifyError, notifyWarning } from "../lib/notify";
import { Robots, Header, Search, RobotEditModal } from "../components/robots";
import { deleteRobot, getCategories, getRobots, updateRobot } from "../service";
import { STATUS_CONFIG } from "../constants/robots/status";

export default function RobotsPage() {
  const [robots, setRobots] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editRobot, setEditRobot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: null,
    controlType: "",
    status: "active",
  });

  const fetchRobots = async () => {
    setLoading(true);
    setError(null);

    const robots = await getRobots();

    if (robots.isError) {
      setError(robots.errorMessage);
      setRobots([]);
    } else {
      setRobots(robots.data || []);
    }

    setLoading(false);
  };

  const fetchCategories = async () => {
    const categories = await getCategories();

    if (categories.isError) {
      setCategories([]);
    } else {
      setCategories(categories.data);
    }
  };

  useEffect(() => {
    fetchRobots();
    fetchCategories();
  }, []);

  // Filter categories based on search input
  const filteredRobot = robots.filter((robot) => {
    const searchLower = search.toLowerCase().trim();

    const name = robot.name?.toLowerCase() || "";
    const controlType = robot.control_type?.toLowerCase() || "";
    const categoryName = robot?.categories?.name.toLowerCase() || "";
    const statusLabel = STATUS_CONFIG[robot.status]?.label.toLowerCase() || "";

    return (
      name.includes(searchLower) ||
      categoryName.includes(searchLower) ||
      controlType === searchLower ||
      statusLabel === searchLower
    );
  });

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: "",
      categoryId: null,
      controlType: "",
      status: "active",
    });
  };

  // Open modal for create or edit
  const openModal = (robot = null) => {
    if (robot) {
      setEditRobot(robot);

      setFormData({
        name: robot.name ?? "",
        categoryId: robot.category_id ?? null,
        controlType: robot.control_type ?? "",
        status: robot.status ?? "active",
      });
    } else {
      setEditRobot(null);
      resetFormData();
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditRobot(null);
    resetFormData();
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.name.trim()) {
      notifyWarning("El nombre del robot es requerido.");
      return false;
    }

    if (!formData.categoryId) {
      notifyWarning("La categoría es requerido.");
      return false;
    }

    if (!formData.controlType) {
      notifyWarning("EL tipo de control es requerido.");
      return false;
    }

    return true;
  };

  // Handle save (create or update)
  const handleEdited = async () => {
    if (!validateForm()) return;

    setSaving(true);

    if (editRobot) {
      const result = await updateRobot({
        robotId: editRobot.id,
        name: formData.name,
        categoryId: editRobot.categories.id,
        controlType: formData.controlType,
        status: formData.status,
      });

      if (result.isError) {
        notifyError(result.errorMessage || "Error al actualizar el robot.");
      } else {
        notifySuccess(result.message || "Robot actualizado correctamente.");

        await fetchRobots();
        closeModal();
      }
    }

    setSaving(false);
  };

  // Handle delete category
  const handleDelete = async (robot) => {
    const result = await deleteRobot({ robotId: robot.id });

    if (result.isError) {
      notifyError(result.message || "Error al eliminar el robot.");
    } else {
      notifySuccess(result.message || "Robot eliminado correctamente.");

      await fetchRobots();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f7f7fa] font-[Poppins] overflow-hidden">
      <Sidebar />

      <section className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden animate-fadeInUp">
        <Header openModal={openModal} />

        <Search search={search} setSearch={setSearch} />

        <Robots
          loading={loading}
          error={error}
          filteredRobot={filteredRobot}
          handleDelete={handleDelete}
          openModal={openModal}
        />
      </section>

      {showModal && (
        <RobotEditModal
          editRobot={editRobot}
          categories={categories}
          closeModal={closeModal}
          formData={formData}
          handleEdited={handleEdited}
          saving={saving}
          setFormData={setFormData}
        />
      )}
    </div>
  );
}
