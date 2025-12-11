import { getErrorMessage, getToken } from "../helpers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUsers = async () => {
  try {
    const TOKEN = getToken();

    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const users = await res.json();

    if (!res.ok) {
      throw new Error(users.error ?? "Error al obtener los usuarios");
    }

    return { isError: false, data: users.data };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const deleteUser = async ({ id }) => {
  try {
    const TOKEN = getToken();

    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? "Error al eliminar el usuario");
    }

    return { isError: false, message: data.message };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const createUser = async (userData) => {
  try {
    const TOKEN = getToken();

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
      throw new Error(data.error ?? "Error al eliminar el usuario");
    }

    return { isError: false, message: data.message };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const updateUser = async ({ id, userData }) => {
  try {
    if (!id) throw new Error("ID del usuario no proporcionado.");

    const TOKEN = getToken();

    // Construir el body solo con los campos presentes
    const body = {};

    const BASE_FIELDS = [
      "name",
      "lastName",
      "age",
      "profile_picture",
      "nickname",
      "email",
      "user_password",
    ];

    BASE_FIELDS.forEach((field) => {
      if (userData[field] !== undefined) {
        body[field] = userData[field];
      }
    });

    // Sub-schema para club_owner
    if (userData.club_owner) {
      body.club_owner = {};
      if (userData.club_owner.dni !== undefined) {
        body.club_owner.dni = userData.club_owner.dni;
      }
      if (userData.club_owner.is_approved !== undefined) {
        body.club_owner.is_approved = userData.club_owner.is_approved;
      }
    }

    // Sub-schema para competitor
    if (userData.competitor) {
      body.competitor = {};
      if (userData.competitor.club_id !== undefined) {
        body.competitor.club_id = userData.competitor.club_id;
      }
      if (userData.competitor.is_approved !== undefined) {
        body.competitor.is_approved = userData.competitor.is_approved;
      }
    }

    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? "Error al actualizar el usuario");
    }

    return { isError: false, message: data.message };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const getTotalUsers = async () => {
  try {
    const TOKEN = getToken();

    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const users = await res.json();

    if (!res.ok) {
      throw new Error(users.error ?? "Error al obtener los usuarios");
    }

    return { isError: false, total: users.total };
  } catch (error) {
    return getErrorMessage({ error });
  }
};