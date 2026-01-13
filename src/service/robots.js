import { getErrorMessage, getToken } from "../helpers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getRobots = async () => {
  try {
    const TOKEN = getToken();

    const res = await fetch(`${API_BASE_URL}/robots`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const robots = await res.json();

    if (!res.ok) throw new Error(robots.error || "Error al obtener los robots");

    return { isError: false, data: robots.data };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const createRobot = async ({ name, categoryId, controlType }) => {
  try {
    const TOKEN = getToken();

    const body = {
      name,
      category_id: categoryId,
      control_type: controlType,
    };

    const res = await fetch(`${API_BASE_URL}/robots`, {
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

export const updateRobot = async ({
  robotId,
  name,
  categoryId,
  controlType,
  status,
}) => {
  const TOKEN = getToken();

  try {
    const body = {
      ...(name !== undefined && { name }),
      ...(categoryId !== undefined && { category_id: categoryId }),
      ...(controlType !== undefined && { control_type: controlType }),
      ...(status !== undefined && { status }),
    };

    const res = await fetch(`${API_BASE_URL}/robots/${robotId}`, {
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

export const deleteRobot = async ({ robotId }) => {
  try {
    const TOKEN = getToken();

    const res = await fetch(`${API_BASE_URL}/robots/${robotId}`, {
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
