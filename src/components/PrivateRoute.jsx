import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";

const PrivateRoute = ({ element }) => {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;








