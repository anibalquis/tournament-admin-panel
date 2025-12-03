const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN = localStorage.getItem("token");

export const getUsers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error ?? "Error al obtener los usuarios");
    }

    const users = await res.json();
    return users.data ?? [];
  } catch {
    return [];
  }
};

export const deleteUser = async ({ id }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = { error: "Error al eliminar el usuario" };
      }
      throw new Error(errorData.error ?? "Error al eliminar el usuario");
    }

    // Manejar caso donde no haya contenido (204 No Content)
    let data = {};
    try {
      data = await res.json();
    } catch {
      data = { message: "Usuario eliminado correctamente" };
    }

    return {
      isError: false,
      message: data.message ?? "Usuario eliminado correctamente",
    };
  } catch (error) {
    return {
      isError: true,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

export const createUser = async (userData) => {
  try {
    // Construir el cuerpo de la petición con los campos base
    const body = {
      name: userData.name,
      lastName: userData.lastName,
      age: userData.age,
      nickname: userData.nickname,
      email: userData.email,
      user_password: userData.user_password,
      role: userData.role,
    };

    // Agregar campos adicionales según el rol
    if (userData.role === "competitor") {
      body.club_id = userData.club_id;
    } else if (userData.role === "club_owner") {
      body.dni = userData.dni;
    }

    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        isError: true,
        errors: data.error,
      };
    }

    // Retornar el mensaje de éxito
    return {
      isError: false,
      message: data.message,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    return {
      isError: true,
      errors: [error instanceof Error ? error.message : "Error desconocido"],
    };
  }
};
