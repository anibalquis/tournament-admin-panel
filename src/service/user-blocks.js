const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const getUserBlocks = async () => {
  try {
    const TOKEN = getToken();

    if (!TOKEN) {
      throw new Error("Token no encontrado. Inicie sesión nuevamente.");
    }

    const res = await fetch(`${API_BASE_URL}/users/blocks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const userBlocks = await res.json();

    if (!res.ok) {
      throw new Error(userBlocks.error || "Error al obtener los bloqueos.");
    }

    return { isError: false, data: userBlocks.data };
  } catch (error) {
    return {
      isError: true,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error en el servidor. Por favor, inténtalo de nuevo.",
    };
  }
};

export const createUserBlocks = async ({ user_id, reason }) => {
  try {
    const TOKEN = getToken();

    if (!TOKEN) {
      throw new Error("Token no encontrado. Inicie sesión nuevamente.");
    }

    const res = await fetch(`${API_BASE_URL}/users/blocks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        user_id,
        reason,
      }),
    });

    const newUserBlock = await res.json();

    if (!res.ok) {
      throw new Error(newUserBlock.error || "No se pudo crear el bloqueo.");
    }

    return { isError: false, message: newUserBlock.message };
  } catch (error) {
    return {
      isError: true,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error en el servidor. Por favor, inténtalo de nuevo.",
    };
  }
};

export const updateLockStatus = async ({ userBlockId, status }) => {
  const TOKEN = getToken();

  if (!TOKEN) {
    throw new Error("Token no encontrado. Inicie sesión nuevamente.");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/users/blocks/${userBlockId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "No se pudo actualizar el estado del bloqueo.")
    }

    return {
      isError: false,
      message: data.message,
    };
  } catch (error) {
    return {
      isError: true,
      errorMessage:
        error instanceof Error
          ? error.message
          : "Ocurrió un error en el servidor. Por favor, inténtalo de nuevo.",
    };
  }
};
