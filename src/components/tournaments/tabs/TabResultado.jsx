import { useState } from "react";
import { FiAward } from "react-icons/fi";
import { startTournament, matchTournament } from "../../../service/tournaments";
import { notifyError } from "../../../lib/notify";

export const TabResultado = ({
  tournamentId,
  matches,
  tournamentPrizes,
  registrations,
  onTournamentUpdated,
}) => {
  const [isStarting, setIsStarting] = useState(false);
  const [updatingMatchId, setUpdatingMatchId] = useState(null);

  const handleStartTournament = async () => {
    try {
      setIsStarting(true);

      await startTournament({ tournamentId });
      await onTournamentUpdated?.();
    } catch {
      notifyError("No se pudo iniciar el torneo. Inténtalo nuevamente.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleSetWinner = async (matchId, competitorId) => {
    try {
      setUpdatingMatchId(matchId);

      await matchTournament({
        matchId,
        winnerId: competitorId,
      });

      await onTournamentUpdated?.();
    } catch {
      notifyError(
        "No se pudo guardar el resultado del match. Inténtalo nuevamente."
      );
    } finally {
      setUpdatingMatchId(null);
    }
  };

  if (!matches || matches.length === 0) {
    const canStartTournament =
      registrations.length === 8 || registrations.length === 16;

    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-gray-500 italic">
          No hay enfrentamientos registrados para este torneo.
        </p>

        {canStartTournament && (
          <button
            onClick={handleStartTournament}
            disabled={isStarting}
            className={`inline-flex items-center justify-center px-5 py-2 rounded-lg font-medium transition cursor-pointer
            ${
              isStarting
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isStarting ? "Cargando enfrentamientos..." : "Iniciar torneo"}
          </button>
        )}

        {!canStartTournament && (
          <p className="text-xs text-gray-400">
            El torneo requiere 8 o 16 participantes para iniciar.
          </p>
        )}
      </div>
    );
  }

  // Group matches by round
  const matchesByRound = matches.reduce((acc, match) => {
    const round = match.round_number || 1;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {});

  const sortedRounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b);

  // Get round label based on position from end
  const getRoundLabel = (round, totalRounds) => {
    const fromEnd = totalRounds - sortedRounds.indexOf(round);
    if (fromEnd === 1) return "Final";
    if (fromEnd === 2) return "Semifinal";
    if (fromEnd === 3) return "Cuartos de Final";
    if (fromEnd === 4) return "Octavos de Final";
    return `Ronda ${round}`;
  };

  // Get competitor display name (nickname preferred)
  const getCompetitorName = (competitor) => {
    if (!competitor?.user) return "TBD";
    return (
      competitor.user.nickname ||
      `${competitor.user.name} ${competitor.user.lastName || ""}`.trim()
    );
  };

  // Find winner from prizes or last match
  const winner = tournamentPrizes?.find(
    (p) => p.prize === "first" || p.prize === "1st"
  );
  const finalMatch = matchesByRound[sortedRounds[sortedRounds.length - 1]]?.[0];

  return (
    <div className="space-y-6">
      {/* Winner Trophy */}
      {winner && (
        <div className="bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-xl p-4 shadow-lg text-center">
          <FiAward className="mx-auto text-yellow-700 mb-2" size={40} />
          <h3 className="text-lg font-bold text-yellow-800">🏆 Campeón</h3>
          <p className="text-xl font-semibold text-yellow-900">
            {winner.competitor?.user?.nickname ||
              winner.competitor?.user?.name ||
              "N/A"}
          </p>
        </div>
      )}

      {/* Bracket Container */}
      <div className="overflow-x-auto">
        <div className="flex gap-8 min-w-max py-4">
          {sortedRounds.map((round, roundIndex) => (
            <div
              key={round}
              className="flex flex-col justify-center min-w-[200px]"
            >
              {/* Round Header */}
              <div className="text-center mb-4">
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {getRoundLabel(round, sortedRounds.length)}
                </span>
              </div>

              {/* Matches in this round */}
              <div
                className="flex flex-col gap-4"
                style={{
                  marginTop:
                    roundIndex > 0 ? `${Math.pow(2, roundIndex) * 20}px` : 0,
                }}
              >
                {matchesByRound[round].map((match) => (
                  <div
                    key={match.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                  >
                    {/* Competitor A */}
                    <div
                      className={`group px-4 py-2 flex items-center justify-between border-b ${
                        match.winner_id === match.competitor_a
                          ? "bg-green-50 border-green-200"
                          : ""
                      }`}
                    >
                      <span
                        className={`font-medium ${
                          match.winner_id === match.competitor_a
                            ? "text-green-700"
                            : "text-gray-700"
                        }`}
                      >
                        {getCompetitorName(match.competitorA)}
                      </span>

                      {match.status !== "finished" && (
                        <button
                          onClick={() =>
                            handleSetWinner(match.id, match.competitor_a)
                          }
                          disabled={updatingMatchId === match.id}
                          className="opacity-0 group-hover:opacity-100 text-xs bg-[#FFBBE1] hover:bg-indigo-700 text-white ml-2 py-1 px-3 rounded-full cursor-pointer transition"
                        >
                          {updatingMatchId === match.id ? "..." : "Gana"}
                        </button>
                      )}

                      {match.winner_id === match.competitor_a && (
                        <span className="text-green-600 text-sm">✓</span>
                      )}
                    </div>

                    {/* VS Divider */}
                    <div className="text-center text-xs text-gray-400 py-1 bg-gray-50">
                      vs
                    </div>

                    {/* Competitor B */}
                    <div
                      className={`group px-4 py-2 flex items-center justify-between ${
                        match.winner_id === match.competitor_b
                          ? "bg-green-50"
                          : ""
                      }`}
                    >
                      <span
                        className={`font-medium ${
                          match.winner_id === match.competitor_b
                            ? "text-green-700"
                            : "text-gray-700"
                        }`}
                      >
                        {getCompetitorName(match.competitorB)}
                      </span>

                      {match.status !== "finished" && (
                        <button
                          onClick={() =>
                            handleSetWinner(match.id, match.competitor_b)
                          }
                          disabled={updatingMatchId === match.id}
                          className="opacity-0 group-hover:opacity-100 text-xs bg-[#FFBBE1] hover:bg-indigo-700 text-white ml-2 py-1 px-3 rounded-full cursor-pointer transition"
                        >
                          {updatingMatchId === match.id ? "..." : "Gana"}
                        </button>
                      )}

                      {match.winner_id === match.competitor_b && (
                        <span className="text-green-600 text-sm">✓</span>
                      )}
                    </div>

                    {/* Match Status */}
                    <div className="px-4 py-1 bg-gray-50 text-xs text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          match.status === "finished"
                            ? "bg-green-100 text-green-700"
                            : match.status === "ongoing"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {match.status === "finished"
                          ? "Finalizado"
                          : match.status === "ongoing"
                          ? "En curso"
                          : "Pendiente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Final Trophy Column */}
          {finalMatch && (
            <div className="flex flex-col justify-center min-w-[100px] gap-y-2">
              <div className="text-center">
                <span className="bg-linear-to-b from-yellow-300 to-yellow-500 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center shadow-lg">
                  <FiAward className="text-yellow-800" size={32} />
                </span>
                <p className="mt-2 text-sm font-medium text-gray-600">
                  Campeón
                </p>
              </div>

              {tournamentPrizes.map((winner) => (
                <p className="bg-green-50 text-green-700 font-medium px-4 py-2 flex items-center justify-between border rounded-sm">
                  {`${winner.competitor.user.name} ${winner.competitor.user.lastName}`.trim()}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
