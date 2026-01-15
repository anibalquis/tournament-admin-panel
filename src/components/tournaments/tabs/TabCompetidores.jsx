import { FiCpu, FiUser } from "react-icons/fi";

export const TabCompetidores = ({ registrations }) => {
  if (!registrations || registrations.length === 0) {
    return <p className="text-gray-500 italic">No hay competidores registrados.</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-2">
        {registrations.length} competidor(es) registrado(s)
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {registrations.map((reg) => {
          const competitor = reg.competitors?.user;
          const robot = reg.robots;

          return (
            <div
              key={reg.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              {/* Competitor info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FiUser className="text-blue-600" size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {competitor?.name || "N/A"} {competitor?.lastName || ""}
                  </h4>
                  {competitor?.nickname && (
                    <p className="text-sm text-indigo-600 font-medium">
                      @{competitor.nickname}
                    </p>
                  )}
                </div>
              </div>

              {/* Robot info */}
              {robot && (
                <div className="bg-gray-50 rounded-lg p-3 mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <FiCpu className="text-gray-500" size={16} />
                    <span className="text-sm font-medium text-gray-700">Robot</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    <p className="text-gray-800">
                      <span className="font-medium">Nombre:</span> {robot.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Control:</span> {robot.control_type || "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
