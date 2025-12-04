import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getClubs, createClub, updateClub, deleteClub } from "../service/clubs";
import { notifySuccess, notifyError, notifyWarning } from "../lib/notify";
import { ClubCreateEditModal, ClubHeader, Clubs, ClubSearch } from "../components/clubs";

export default function ClubesPage() {
  const [clubes, setClubes] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editClub, setEditClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    fiscal_address: "",
    logo: "",
    owner_id: "",
    is_approved: false,
  });

  const fetchClubs = async () => {
    setLoading(true);
    setError(null);

    const result = await getClubs();

    if (result.isError) {
      setError(result.errorMessage);
      setClubes([]);
    } else {
      setClubes(result.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  // Filter clubs based on search input
  const filteredClubes = clubes.filter((club) => {
    const searchLower = search.toLowerCase();
    const nombre = club.name?.toLowerCase() || "";
    const propietario = club.owner?.name?.toLowerCase() || "";
    const direccion = club.fiscal_address?.toLowerCase() || "";
    const estado = club.is_approved ? "aprobado" : "pendiente";

    return (
      nombre.includes(searchLower) ||
      propietario.includes(searchLower) ||
      direccion.includes(searchLower) ||
      estado.includes(searchLower)
    );
  });

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: "",
      fiscal_address: "",
      logo: "",
      owner_id: "",
      is_approved: false,
    });
  };

  // Open modal for create or edit
  const openModal = (club = null) => {
    if (club) {
      setEditClub(club);
      setFormData({
        name: club.name || "",
        fiscal_address: club.fiscal_address || "",
        logo: club.logo || "",
        owner_id: club.owner?.id || "",
        is_approved: club.is_approved || false,
      });
    } else {
      setEditClub(null);
      resetFormData();
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditClub(null);
    resetFormData();
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.name.trim()) {
      notifyWarning("El nombre del club es requerido.");
      return false;
    }
    if (!formData.fiscal_address.trim()) {
      notifyWarning("La dirección fiscal es requerida.");
      return false;
    }
    if (!formData.owner_id) {
      notifyWarning("El ID del propietario es requerido.");
      return false;
    }
    const ownerId = parseInt(formData.owner_id, 10);
    if (isNaN(ownerId) || ownerId <= 0) {
      notifyWarning("El ID del propietario debe ser un número válido.");
      return false;
    }
    return true;
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    if (editClub) {
      // Update club
      const result = await updateClub({
        clubId: editClub.id,
        name: formData.name,
        fiscal_address: formData.fiscal_address,
        logo: formData.logo || null,
        is_approved: formData.is_approved,
      });

      if (result.isError) {
        notifyError(result.errorMessage || "Error al actualizar el club.");
      } else {
        notifySuccess(result.message || "Club actualizado correctamente.");
        closeModal();
        await fetchClubs();
      }
    } else {
      // Create club
      const result = await createClub({
        name: formData.name,
        fiscal_address: formData.fiscal_address,
        logo: formData.logo || null,
        owner_id: parseInt(formData.owner_id, 10),
      });

      if (result.isError) {
        const errorMsg = result.message || "Error al crear el club.";
        notifyError(errorMsg);
      } else {
        notifySuccess(result.message || "Club creado correctamente.");
        closeModal();
        await fetchClubs();
      }
    }

    setSaving(false);
  };

  // Handle toggle approval status
  const handleValidate = async (club) => {
    const newApprovalStatus = !club.is_approved;

    const result = await updateClub({
      clubId: club.id,
      is_approved: newApprovalStatus,
    });

    if (result.isError) {
      notifyError(
        result.errorMessage || "Error al cambiar el estado del club."
      );
    } else {
      notifySuccess(
        newApprovalStatus
          ? "Club aprobado correctamente."
          : "Club marcado como pendiente."
      );
      await fetchClubs();
    }
  };

  // Handle delete club
  const handleDelete = async (club) => {
    const result = await deleteClub({ clubId: club.id });

    if (result.isError) {
      notifyError(result.message || "Error al eliminar el club.");
    } else {
      notifySuccess(result.message || "Club eliminado correctamente.");
      await fetchClubs();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f7f7fa] font-[Poppins] overflow-hidden">
      <Sidebar />

      <section className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden animate-fadeInUp">
        <ClubHeader openModal={openModal}/>

        <ClubSearch search={search} setSearch={setSearch} />

        <Clubs
          loading={loading}
          error={error}
          filteredClubes={filteredClubes}
          handleDelete={handleDelete}
          handleValidate={handleValidate}
          openModal={openModal}
        />
      </section>

      {showModal && (
        <ClubCreateEditModal
          editClub={editClub}
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