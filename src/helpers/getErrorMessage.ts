export const getErrorMessage = ({ error }) => {
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Ocurrió un error en el servidor. Por favor, inténtalo de nuevo.";

  return { isError: true, message: errorMessage };
};