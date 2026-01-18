import { getErrorMessage } from "../helpers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getClubRankings = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/rankings/clubs`, {
      method: "GET",
    });

    const clubs = await res.json();

    if (!res.ok)
      throw new Error(clubs.error || "Error al obtener el ranking de clubs");

    return { isError: false, data: clubs.data };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const getCompetitorRankings = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/rankings/competitors`, {
      method: "GET",
    });

    const clubs = await res.json();

    if (!res.ok)
      throw new Error(
        clubs.error || "Error al obtener el ranking de competidores",
      );

    return { isError: false, data: clubs.data };
  } catch (error) {
    return getErrorMessage({ error });
  }
};
