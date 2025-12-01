import { useState, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData, token) => {
    window.localStorage.setItem("user", JSON.stringify(userData));
    window.localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    window.localStorage.clear();
    setUser(null);
    window.location.href = '/'
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider }