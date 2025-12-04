import { toast } from "sonner";

export const notifyError = (errorMessage) => {
  toast.error(errorMessage, {
    position: "top-center",
  });
};

export const notifyInfo = (infoMessage) => {
  toast.info(infoMessage, {
    position: "top-center",
  });
};

export const notifySuccess = (successMessage) => {
  toast.success(successMessage,
    { position: "top-center" }
  );
};

export const notifyWarning = (warningMessage) => {
  toast.warning(warningMessage, {
    position: "top-center",
  });
};