import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("vox_user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  // If there's already a cached user and token, we don't need a full blocking screen
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem("vox_token");
    const cachedUser = localStorage.getItem("vox_user");
    return token && !cachedUser;
  });

  useEffect(() => {
    const token = localStorage.getItem("vox_token");
    if (!token) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    api.get("/auth/me")
      .then(({ data }) => {
        if (!isMounted) return;
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("vox_user", JSON.stringify(data.user));
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        // Only wipe credentials on explicit 401 Unauthorized
        if (err?.response?.status === 401) {
          localStorage.removeItem("vox_token");
          localStorage.removeItem("vox_user");
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function login(credentials) {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("vox_token", data.token);
    localStorage.setItem("vox_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function register(details) {
    const { data } = await api.post("/auth/register", details);
    localStorage.setItem("vox_token", data.token);
    localStorage.setItem("vox_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("vox_token");
    localStorage.removeItem("vox_user");
    setUser(null);
  }

  function updateUser(updated) {
    setUser((prev) => {
      const nextUser = typeof updated === "function" ? updated(prev) : { ...prev, ...updated };
      if (nextUser) {
        localStorage.setItem("vox_user", JSON.stringify(nextUser));
      } else {
        localStorage.removeItem("vox_user");
      }
      return nextUser;
    });
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setUser: updateUser, updateUser }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
