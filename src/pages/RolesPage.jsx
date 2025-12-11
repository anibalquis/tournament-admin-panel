import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "@fontsource/poppins";
import "@fontsource/inter";
import { deleteUser, getUsers, createUser, updateUser } from "../service/users";
import { getClubs } from "../service/clubs";
import { notifyError, notifySuccess } from "../lib/notify";
import {
  UserHeader,
  UserTable,
  UserCreateEditModal,
  UserFilters,
} from "../components/users";

export default function RolesPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    age: "",
    nickname: "",
    email: "",
    user_password: "",
    role: "admin",
    club_id: "",
    dni: "",
  });

  // Cargar usuarios y clubes al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Cargar usuarios
        const usersResult = await getUsers();
        if (!usersResult?.isError) {
          setUsers(usersResult?.data || []);
        }

        // Cargar clubes desde la API
        const clubsResult = await getClubs();
        if (!clubsResult?.isError) {
          setClubs(clubsResult?.data || []);
        }
      } catch {
        notifyError("Error al cargar los datos");
        setUsers([]);
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (user = null) => {
    if (user) {
      setEditUser(user);
      setFormData({
        name: user.name,
        lastName: user.lastName || "",
        age: user.age || "",
        nickname: user.nickname || "",
        email: user.email,
        user_password: "",
        role: user.role,
        competitor_is_approved: user?.competitor?.is_approved || false,
        club_owner_is_approved: user?.club_owner?.is_approved || false,
        club_id: user?.competitor?.club_id || "",
        dni: user?.club_owner?.dni || "",
      });
    } else {
      setEditUser(null);
      setFormData({
        name: "",
        lastName: "",
        age: "",
        nickname: "",
        email: "",
        user_password: "",
        role: "admin",
        club_id: "",
        dni: "",
      });
    }
    setShowModal(true);
  };

  const resetFormAndCloseModal = () => {
    setShowModal(false);
    setEditUser(null);
    setFormData({
      name: "",
      lastName: "",
      age: "",
      nickname: "",
      email: "",
      user_password: "",
      role: "admin",
      club_id: "",
      dni: "",
    });
  };

  const handleCreate = async () => {
    // Preparar los datos del usuario
    const userData = {
      name: formData.name,
      lastName: formData.lastName,
      age: parseInt(formData.age),
      nickname: formData.nickname,
      email: formData.email,
      user_password: formData.user_password,
      role: formData.role,
    };

    // Agregar campos condicionales según el rol
    if (formData.role === "competitor") {
      userData.club_id = parseInt(formData.club_id);
    } else if (formData.role === "club_owner") {
      userData.dni = formData.dni;
    }

    const result = await createUser(userData);

    if (result?.isError) {
      notifyError(result.message);
      return;
    }

    notifySuccess(result?.message || "Usuario creado correctamente");
    resetFormAndCloseModal();

    // Recargar lista de usuarios
    const usersResult = await getUsers();
    if (!usersResult?.isError) {
      setUsers(usersResult?.data || []);
    }
  };

  const handleUpdate = async () => {
    if (!editUser?.id) return;

    // Construir los datos a actualizar
    const userData = {
      name: formData.name,
      lastName: formData.lastName,
      age: parseInt(formData.age),
      nickname: formData.nickname,
      email: formData.email,
    };

    // Agregar password solo si fue proporcionado
    if (formData.user_password) {
      userData.user_password = formData.user_password;
    }

    // Agregar datos específicos según el rol
    if (formData.role === "competitor") {
      userData.competitor = {
        club_id: parseInt(formData.club_id),
        is_approved: formData.competitor_is_approved,
      };
    } else if (formData.role === "club_owner") {
      userData.club_owner = {
        dni: formData.dni,
        is_approved: formData.club_owner_is_approved,
      };
    }

    const result = await updateUser({ id: editUser.id, userData });

    if (result?.isError) {
      notifyError(result.message);
      return;
    }

    notifySuccess(result?.message || "Usuario actualizado correctamente");
    resetFormAndCloseModal();

    // Recargar lista de usuarios
    const usersResult = await getUsers();
    if (!usersResult?.isError) {
      setUsers(usersResult?.data || []);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;

    const result = await deleteUser({ id });

    if (result?.isError) {
      notifyError(result?.message || "Error al eliminar el usuario");
      return;
    }

    notifySuccess(result?.message || "Usuario eliminado correctamente");
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f7f7fa] font-[Poppins]">
      <Sidebar />

      <section className="flex-1 p-6 overflow-x-hidden animate-fadeInUp">
        <UserHeader handleOpenModal={openModal} />

        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
        />

        {users && (
          <UserTable
            loading={loading}
            users={users}
            searchTerm={searchTerm}
            roleFilter={roleFilter}
            handleDelete={handleDelete}
            openModal={openModal}
          />
        )}
      </section>

      {showModal && (
        <UserCreateEditModal
          editUser={editUser}
          formData={formData}
          setFormData={setFormData}
          setShowModal={setShowModal}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          clubs={clubs}
        />
      )}
    </div>
  );
}
