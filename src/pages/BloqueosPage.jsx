import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { CreateEditModal, Header, Locks, Search } from "../components/locks";
import { notifySuccess, notifyError, notifyWarning } from "../lib/notify";
import {
  getUserBlocks,
  createUserBlocks,
  updateLockStatus,
} from "../service/user-blocks";

// FUENTES MODERNAS
import "@fontsource/poppins";
import "@fontsource/inter";

export default function BloqueosPage() {
  const [bloqueos, setBloqueos] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBloqueo, setEditBloqueo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    user_id: "",
    reason: "",
    status: "",
  });

  // Fetch user blocks from API
  const fetchBloqueos = async () => {
    setLoading(true);
    setError(null);

    const result = await getUserBlocks();

    if (result.isError) {
      setError(result.message);
      setBloqueos([]);
    } else {
      setBloqueos(result.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBloqueos();
  }, []);

  // Filter blocks based on search input
  const filteredBloqueos = bloqueos.filter((b) => {
    const searchLower = search.toLowerCase();

    const usuarioBloqueado = b.user?.nickname?.toLowerCase() || "";
    const usuarioEjecutor = b.blockedBy?.nickname?.toLowerCase() || "";

    // Estado real
    const estadoRaw = b.status?.toLowerCase() || "";

    // Mapeo del estado a texto visible
    const estadoMap = {
      pending: "pendiente",
      active: "bloqueado",
      lifted: "desbloqueado",
    };

    const estadoBuscable = estadoMap[estadoRaw] || "";

    return (
      usuarioBloqueado.includes(searchLower) ||
      usuarioEjecutor.includes(searchLower) ||
      estadoBuscable.includes(searchLower)
    );
  });

  // Reset form data
  const resetFormData = () => {
    setFormData({
      user_id: "",
      reason: "",
      status: "",
    });
  };

  // Open modal for create or edit
  const openModal = (bloqueo = null) => {
    if (bloqueo) {
      setEditBloqueo(bloqueo);
      setFormData({
        user_id: bloqueo.user?.id || "",
        reason: bloqueo.reason || "",
        status: bloqueo.status || "",
      });
    } else {
      setEditBloqueo(null);
      resetFormData();
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditBloqueo(null);
    resetFormData();
  };

  // Validate form data
  const validateForm = () => {
    if (!editBloqueo) {
      // Creating new block
      if (!formData.user_id) {
        notifyWarning("El ID del usuario es requerido.");
        return false;
      }
      const userId = parseInt(formData.user_id, 10);
      if (isNaN(userId) || userId <= 0) {
        notifyWarning("El ID del usuario debe ser un número válido.");
        return false;
      }
      if (!formData.reason.trim()) {
        notifyWarning("El motivo del bloqueo es requerido.");
        return false;
      }
    } else {
      // Editing block
      if (!formData.status) {
        notifyWarning("Debe seleccionar un estado.");
        return false;
      }
    }
    return true;
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    if (editBloqueo) {
      // Update block status
      const result = await updateLockStatus({
        userBlockId: editBloqueo.id,
        status: formData.status,
      });

      if (result.isError) {
        notifyError(result.errorMessage || "Error al actualizar el bloqueo.");
      } else {
        notifySuccess(
          result.message || "Estado del bloqueo actualizado correctamente."
        );
        closeModal();
        await fetchBloqueos();
      }
    } else {
      // Create block
      const result = await createUserBlocks({
        user_id: parseInt(formData.user_id, 10),
        reason: formData.reason,
      });

      if (result.isError) {
        notifyError(result.message || "Error al crear el bloqueo.");
      } else {
        notifySuccess(result.message || "Bloqueo creado correctamente.");
        closeModal();
        await fetchBloqueos();
      }
    }

    setSaving(false);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          label: "Pendiente",
        };
      case "active":
        return {
          bg: "bg-destructive",
          text: "text-white",
          label: "Bloqueado",
        };
      case "lifted":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          label: "Desbloqueado",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          label: status || "Desconocido",
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f7f7fa] font-[Poppins] overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
        <Header openModal={openModal} />

        <Search search={search} setSearch={setSearch} />

        <Locks
          openModal={openModal}
          error={error}
          filteredBloqueos={filteredBloqueos}
          getStatusBadge={getStatusBadge}
          loading={loading}
        />
      </main>

      {/* MODAL */}
      {showModal && (
        <CreateEditModal
          closeModal={closeModal}
          editBloqueo={editBloqueo}
          formData={formData}
          formatDate={formatDate}
          handleSave={handleSave}
          saving={saving}
          setFormData={setFormData}
        />
      )}
    </div>
  );
}
