import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // 🔹 Decodificar token (memoizado)
  const decodedUser = useMemo(() => {
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return {
        username: decoded.username,
        is_staff: decoded.is_staff,
      };
    } catch {
      return null;
    }
  }, [token]);

  // 🔹 Setear usuario cuando cambia el token
  useEffect(() => {
    setUser(decodedUser);
  }, [decodedUser]);

  // 🔹 Función global para actualizar carrito (EXACTAMENTE lo que faltaba)
  const loadCartCount = useCallback(
    async (customToken = token) => {
      if (!customToken) {
        setCartCount(0);
        return;
      }

      try {
        const response = await api.get("cart/", {
          headers: {
            Authorization: `Bearer ${customToken}`,
          },
        });

        const totalItems = response.data.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        setCartCount(totalItems);
      } catch (error) {
        console.error("Error cargando carrito:", error);
      }
    },
    [token]
  );

  // 🔹 Cargar carrito al iniciar sesión o refrescar
  useEffect(() => {
    if (token) loadCartCount();
  }, [token, loadCartCount]);

  const login = (accessToken) => {
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
    loadCartCount(accessToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        cartCount,
        loadCartCount, // 🔥 AHORA SÍ EXISTE
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
