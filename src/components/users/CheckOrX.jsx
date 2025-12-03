import { FiCheck, FiX } from "react-icons/fi";

export const CheckOrX = (rolActual, rolComparar) => {
  return rolActual === rolComparar ? (
    <FiCheck className="text-green-600 text-xl mx-auto" />
  ) : (
    <FiX className="text-gray-300 text-xl mx-auto" />
  );
};
