import { getErrorMessage, getToken } from "../helpers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getTournaments = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/tournaments`, {
      method: "GET",
    });

    const tournaments = await res.json();

    if (!res.ok)
      throw new Error(tournaments.error || "Error al obtener los torneos");

    return { isError: false, data: tournaments.data };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const getTournament = async ({ tournamentID }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentID}`, {
      method: "GET",
    });

    const tournament = await res.json();

    if (!res.ok)
      throw new Error(tournament.error || "Error al obtener el torneo");

    return { isError: false, data: tournament.data };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const createTournament = async ({
  name,
  description,
  categoryId,
  maxParticipants,
  startDate,
  endDate,
  judgeId,
  allowedClubIds,
  combatDurationSec,
}) => {
  try {
    const TOKEN = getToken();

    const body = {
      name,
      category_id: categoryId,
      max_participants: maxParticipants,
      judge_id: judgeId,
      allowed_club_ids: allowedClubIds,
    };

    if (description) body.description = description;
    if (startDate) body.start_date = startDate;
    if (endDate) body.end_date = endDate;
    if (combatDurationSec) body.combat_duration_sec = combatDurationSec;

    const res = await fetch(`${API_BASE_URL}/tournaments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    const errorMessage = Array.isArray(data?.error)
      ? data.error[0]
      : data?.error;

    if (!res.ok) throw new Error(errorMessage || "Error al crear un torneo");

    return { isError: false, message: data.message };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const updateTournament = async ({
  tournamentId,
  name,
  description,
  maxParticipants,
  startDate,
  endDate,
  status,
  combatDurationSec,
}) => {
  try {
    const TOKEN = getToken();

    const body = {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(maxParticipants !== undefined && {
        max_participants: maxParticipants,
      }),
      ...(startDate !== undefined && { start_date: startDate }),
      ...(endDate !== undefined && { end_date: endDate }),
      ...(status !== undefined && { status }),
      ...(combatDurationSec !== undefined && {
        combat_duration_sec: combatDurationSec,
      }),
    };

    const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    const errorMessage = Array.isArray(data?.error)
      ? data.error[0]
      : data.error;

    if (!res.ok)
      throw new Error(errorMessage || "Error al actualizar el torneo");

    return { isError: false, message: data.message };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const deleteTournament = async ({ tournamentID }) => {
  try {
    const TOKEN = getToken();

    const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentID}`, {
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

export const startTournament = async ({ tournamentId }) => {
  try {
    const TOKEN = getToken();

    const res = await fetch(
      `${API_BASE_URL}/tournaments/${tournamentId}/start`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    const tournaments = await res.json();

    if (!res.ok)
      throw new Error(tournaments.error || "Error al iniciar torneos");

    return { isError: false, data: tournaments.data };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const matchTournament = async ({ matchId, winnerId }) => {
  try {
    const TOKEN = getToken();

    const res = await fetch(`${API_BASE_URL}/matches/${matchId}/result`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        winner_id: winnerId,
      }),
    });

    const tournaments = await res.json();

    if (!res.ok)
      throw new Error(tournaments.error || "Error al iniciar enfrentamiento");

    return { isError: false, data: tournaments.data };
  } catch (error) {
    return getErrorMessage({ error });
  }
};

export const getTotalTournaments = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/tournaments`, {
      method: "GET",
    });

    const tournaments = await res.json();

    if (!res.ok) {
      throw new Error(tournaments.error ?? "Error al obtener el total de torneos");
    }

    return { isError: false, total: tournaments.total };
  } catch (error) {
    return getErrorMessage({ error });
  }
};