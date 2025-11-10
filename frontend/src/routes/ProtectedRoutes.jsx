import React, { useEffect, useState } from "react";
import { verifyUser } from "../api/auth.api";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const [auth, setAuth] = useState(null); // null = loading, true/false = ready

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await verifyUser();
        setAuth(!!res.data.user);
      } catch {
        setAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (auth === null) return <div className="text-center mt-10">Loading...</div>;

  return auth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
