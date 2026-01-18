export const ClubRankings = ({ clubRankings, loadingRankings }) => {
  if (loadingRankings) {
    return (
      <div className="flex justify-center items-center py-12 bg-white rounded-xl shadow">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 font-medium">Cargando ranking...</p>
        </div>
      </div>
    );
  }

  return (
    <table className="min-w-full text-sm text-gray-700">
      <thead>
        <tr className="border-b bg-gray-50">
          <th className="py-2 px-2">#</th>
          <th className="py-2 px-2">Club</th>
          <th className="py-2 px-2 text-right">Puntaje</th>
        </tr>
      </thead>
      <tbody>
        {clubRankings.map((item) => (
          <tr
            key={item.position}
            className="border-b last:border-none hover:bg-gray-50 transition"
          >
            <td className="py-2 px-2">{item.position}</td>
            <td className="py-2 px-2">{item.club.name}</td>
            <td className="py-2 px-2 text-right font-semibold text-gray-900">
              {item.total_points} pts
            </td>
          </tr>
        ))}

        {clubRankings.length === 0 && (
          <tr>
            <td colSpan="3" className="text-center text-gray-500 py-6 italic">
              No hay datos disponibles
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
