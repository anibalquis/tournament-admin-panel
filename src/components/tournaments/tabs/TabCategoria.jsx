export const TabCategoria = ({ category }) => {
  if (!category) {
    return <p className="text-gray-500 italic">No hay información de categoría disponible.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-indigo-600 mb-1">Nombre de la Categoría</h4>
        <p className="text-lg font-semibold text-gray-800">{category.name}</p>
      </div>
      {category.description && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Descripción</h4>
          <p className="text-gray-700">{category.description}</p>
        </div>
      )}
    </div>
  );
};
