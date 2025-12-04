const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN = localStorage.getItem("token");

export const getClubs = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/clubs`, {
      method: "GET",
    });

    const clubs = await res.json();

    if (!res.ok) throw new Error(clubs.error || "Error al obtener los clubs");

    return { isError: false, data: clubs.data };
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

// TODO: Corregir error de autenticación y CORS al primer render.
/**
 * Al cargar la vista por primera vez sin recargar, las peticiones POST, PATCH y DELETE
 * fallan por política CORS y retornan: "Token inválido o expirado".
 * Verificar inicialización del token, orden de montaje y manejo del preflight OPTIONS.
 */

export const createClub = async ({
  name,
  fiscal_address,
  owner_id,
  logo = null,
}) => {
  try {
    const body = {
      name,
      fiscal_address,
      owner_id,
      logo,
    };

    const res = await fetch(`${API_BASE_URL}/clubs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);
    return { isError: false, message: data.message };
  } catch (error) {
    return {
      isError: true,
      message: error instanceof Error
        ? error.message
        : "Ocurrió un error en el servidor. Por favor, inténtalo de nuevo.",
    };
  }
};

export const deleteClub = async ({ clubId }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/clubs/${clubId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    return { isError: false, message: data.message };
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

export const updateClub = async ({
  clubId,
  name,
  fiscal_address,
  logo,
  is_approved,
}) => {
  console.log({ token: TOKEN });

  try {
    const body = {
      ...(name && { name }),
      ...(fiscal_address && { fiscal_address }),
      ...(logo !== undefined && { logo }),
      ...(typeof is_approved === "boolean" && { is_approved }),
    };

    const res = await fetch(`${API_BASE_URL}/clubs/${clubId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

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
