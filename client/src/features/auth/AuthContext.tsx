import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
// 1. Import useQueryClient
import { useQueryClient } from "@tanstack/react-query"; 

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  login: (user: User, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  // 2. Get the query client instance
  const queryClient = useQueryClient(); 

  // SAFE user load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        setUser(null);
        return;
      }

      const parsed = JSON.parse(storedUser);
      setUser(parsed);
    } catch (err) {
      console.error("Failed to load user:", err);
      setUser(null);
    }
  }, []);

  // LOGIN FUNCTION
  const login = (user: User, token?: string) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));

    if (token) {
      localStorage.setItem("token", token);
    }
  };

  // LOGOUT FUNCTION
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // 3. Clear all cached data (orders, products, etc.)
    // This forces a fresh fetch for the next user
    queryClient.removeQueries(); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}