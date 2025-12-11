import { ROLE_CONFIG } from "./constants/roles"

export const RoleBadge = ({ role }) => {
  const config = ROLE_CONFIG[role] || {
    label: role || "—",
    className: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`text-sm font-semibold truncate ${config.className}`}
    >
      {config.label}
    </span>
  );
};
