import { FiMail, FiUser } from "react-icons/fi";

export const TabJuez = ({ judges }) => {
  if (!judges || judges.length === 0) {
    return <p className="text-gray-500 italic">No hay jueces asignados a este torneo.</p>;
  }

  return (
    <div className="space-y-4">
      {judges.map((judgeEntry, index) => {
        const judge = judgeEntry.judges?.user;
        if (!judge) return null;

        return (
          <div
            key={judge.id || index}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <FiUser className="text-indigo-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  {judge.name} {judge.lastName}
                </h4>
                <p className="text-sm text-gray-500">Juez del torneo</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiMail className="text-gray-400" />
              <span>{judge.email || "Sin correo registrado"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
