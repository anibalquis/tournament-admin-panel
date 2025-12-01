const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const sendingLogin = async ({ email, password }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        user_password: password,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error ?? "Error al inicicar sesión");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error ?? "Error al enviar el correo de recuperación");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      isError: true,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

export const resetPassword = async ({ newPassword, tokenReset }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password/${tokenReset}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error ?? "Error al restablecer la contraseña");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      isError: true,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};
