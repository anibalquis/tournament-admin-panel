import { STATUS_CONFIG } from "../../constants/robots/status";

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status];

  return (
    <span className={`text-xs font-semibold truncate ${config.className}`}>
      {config.label}
    </span>
  );
};
