import { getErrorMessage, getToken } from "../helpers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getClubs = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/clubs`, {
      method: "GET",
    });

    const clubs = await res.json();

    if (!res.ok) throw new Error(clubs.error || "Error al obtener los clubs");

    return { isError: false, data: clubs.data };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const createClub = async ({
  name,
  fiscal_address,
  owner_id,
  logo = null,
}) => {
  try {
    const TOKEN = getToken();

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
    return getErrorMessage({ error });
  }
};

export const deleteClub = async ({ clubId }) => {
  try {
    const TOKEN = getToken();

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
    return getErrorMessage({ error });
  }
};

export const updateClub = async ({
  clubId,
  name,
  fiscal_address,
  logo,
  is_approved,
}) => {
  const TOKEN = getToken();

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

    return { isError: false, message: data.message };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const getTotalClubs = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/clubs`, {
      method: "GET",
    });

    const clubs = await res.json();

    if (!res.ok) {
      throw new Error(clubs.error ?? "Error al obtener el total de clubes");
    }

    return { isError: false, total: clubs.total };
  } catch (error) {
    return getErrorMessage({ error });
  }
};