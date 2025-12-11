export const ApprovalBadge = ({ isApproved }) => {
  if (isApproved === null || isApproved === undefined) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
        —
      </span>
    );
  }

  if (isApproved === true) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        Aprobado
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
      Pendiente
    </span>
  );
};
