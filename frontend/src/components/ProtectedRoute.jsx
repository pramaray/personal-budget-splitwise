import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>; // 👈 Optional spinner
  }

  if (!user||!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

