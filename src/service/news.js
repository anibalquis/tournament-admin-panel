import { getErrorMessage, getToken } from "../helpers"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getNews = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/news`, {
      method: "GET",
    });

    const news = await res.json();

    if (!res.ok) throw new Error(news.error || "Error al obtener las noticias");

    return { isError: false, data: news.data };
  } catch (error) {
    return getErrorMessage({ error })
  }
};

export const createNewsItem = async (payload) => {
  try {
    const TOKEN = getToken();

    const res = await fetch(`${API_BASE_URL}/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error al crear noticia");

    return { isError: false, message: data.message };
  } catch (error) {
    return getErrorMessage({ error })
  }
};

export const deleteNewsItem = async ({ newsID }) => {
  try {
    const TOKEN = getToken()

    const res = await fetch(`${API_BASE_URL}/news/${newsID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    return { isError: false, message: data.message };
  } catch (error) {
    return getErrorMessage({ error })
  }
};

export const updateNewsItem = async (newsID, payload) => {
  try {
    const TOKEN = getToken();

    const res = await fetch(`${API_BASE_URL}/news/${newsID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error al actualizar noticia");

    return { isError: false, data: data.data, message: data.message };
  } catch (error) {
    return getErrorMessage({ error })
  }
};
