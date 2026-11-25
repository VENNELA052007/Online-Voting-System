import React from "react";
import { Navigate } from "react-router-dom";

// Shows the page only if the logged-in user has the right role.
// Otherwise sends the visitor to the login page.
export default function ProtectedRoute({ user, role, children }) {
  if (!user || user.role !== role) {
    return <Navigate to={role === "admin" ? "/login/admin" : "/login/user"} replace />;
  }
  return children;
}
