// src/components/ProtectedAdmin.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "../Context/AuthContext";

export default function ProtectedAdmin({ children }) {
  const { authUser } = useContext(Auth);

  if (!authUser) return <Navigate to="/login" />;
  if (!authUser.IsAdmin) return <Navigate to="/" />;

  return children;
}
