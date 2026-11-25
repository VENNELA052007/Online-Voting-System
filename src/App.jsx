import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import VoterDashboard from "./pages/VoterDashboard";

export default function App() {
  // The logged-in user (the session). It lives here, in the top component,
  // and is passed down to the pages that need it as props.
  const [user, setUser] = useLocalStorage("currentUser", null);

  // Role-based redirection: admin -> /admin, voter -> /dashboard
  const dashboardPath = user && user.role === "admin" ? "/admin" : "/dashboard";

  return (
    <Layout user={user} onLogout={() => setUser(null)}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to={dashboardPath} replace /> : <Login onLogin={setUser} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to={dashboardPath} replace /> : <Signup />}
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} role="user">
              <VoterDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
