import { createContext, useState, useMemo, useCallback, useEffect, useContext } from "react";
import * as UserApi from "../api/user";
import * as api from "../api/index";
import config from "../config.json";

const AuthContext = createContext();
const JWT_KEY = config.token_key;

const useAuth = () => useContext(AuthContext);

export const useSession = () => {
  const { token, user, ready } = useAuth();
  return { token, user, ready, isAuthed: Boolean(token) };
};

export const useLogin = () => {
  const { login } = useAuth();
  return login;
};

export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(JWT_KEY));
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const login = useCallback(async (email, password) => {
    try {
      const { token, user } = await UserApi.login(email, password);
      setToken(token);
      setUser(user);
      if (user) {
        localStorage.setItem("username", user.username);
        localStorage.setItem("email", user.email);
      }
      if (user) return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setReady(Boolean(token));
    api.setAuthToken(token);
    if (token) localStorage.setItem(JWT_KEY, token);
    else localStorage.removeItem(JWT_KEY);
  }, [token, user]);

  const value = useMemo(
    () => ({
      token,
      user,
      ready,
      login,
      logout,
    }),
    [token, user, login, logout, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
