import React from "react";
import { Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";

function ProtectedRoute({ children }: any) {
  const { userId } = useAuth();
  const isLoggedIn = userId ? true : false;
  const location = useLocation();

  if (!isLoggedIn && location.pathname !== "/login") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
