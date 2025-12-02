import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import type { JSX } from "react";

export default function GuestRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}