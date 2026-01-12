import { getErrorMessage, getToken } from "../helpers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCategories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: "GET",
    });

    const categories = await res.json();

    if (!res.ok)
      throw new Error(categories.error || "Error al obtener las categorías");

    return { isError: false, data: categories.data };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const createCategory = async ({ name, description = null }) => {
  try {
    const TOKEN = getToken();

    const body = { name, description };

    const res = await fetch(`${API_BASE_URL}/categories`, {
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

export const updateCategory = async ({ categoryId, name, description }) => {
  const TOKEN = getToken();

  try {
    const body = {
      ...(name && { name }),
      ...(description && { description }),
    };

    const res = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
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

export const deleteCategory = async ({ categoryId }) => {
  try {
    const TOKEN = getToken();

    const res = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
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
