import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function GuestRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
