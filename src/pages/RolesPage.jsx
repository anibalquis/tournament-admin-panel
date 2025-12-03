import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "@fontsource/poppins";
import "@fontsource/inter";
import { deleteUser, getUsers, createUser } from "../service/users";
import { notifyError, notifySuccess } from "../lib/notify";
import {
  UserSearch,
  UserHeader,
  UserTable,
  UserCreateEditModal,
} from "../components/users";

export default function RolesPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data || []);
      } catch {
        notifyError("Error al cargar los usuarios");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    // Cargar clubes para el dropdown de competidores
    // Por ahora usamos datos estáticos, pero se puede cambiar por una API
    setClubs([
      { id: 1, nombre: "Robot Masters" },
      { id: 2, nombre: "TechBots" },
    ]);

    fetchUsers();
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
        club_id: user.club_id || "",
        dni: user.dni || "",
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

  const handleCreate = async () => {
    try {
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

      if (result.isError) {
        // Mostrar errores
        const errorMessage = result.errors.joint(", ");
        notifyError(errorMessage);
      } else {
        // Mostrar mensaje de éxito
        notifySuccess(result.message);

        // Cerrar modal
        setShowModal(false);

        // Limpiar formulario
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

        // Recargar lista de usuarios
        const data = await getUsers();
        setUsers(data || []);
      }
    } catch {
      notifyError("Error al crear el usuario");
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;

    try {
      const { isError, message } = await deleteUser({ id });

      if (isError) {
        notifyError(message);
      } else {
        notifySuccess(message);
        window.location.reload(); // Recargar la página para actualizar la lista de usuarios
      }
    } catch {
      notifyError("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f7f7fa] font-[Poppins]">
      <Sidebar />

      <section className="flex-1 p-6 overflow-x-hidden animate-fadeInUp">
        <UserHeader handleOpenModal={openModal} />

        <UserSearch search={search} handleSearch={setSearch} />

        {users && (
          <UserTable
            loading={loading}
            users={users}
            search={search}
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
          clubs={clubs}
        />
      )}
    </div>
  );
}
