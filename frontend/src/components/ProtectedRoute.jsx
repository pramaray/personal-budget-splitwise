import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // If token not present, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Else render the protected component
  return children;
}
