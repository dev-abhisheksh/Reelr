import React, { useEffect, useState } from "react";
import { verifyUser } from "../api/auth.api";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyUser();
        setAuthenticated(res.data.success);
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return <Navigate to="/login" replace />;
  
  // ✅ Render the children properly
  return children;
};

export default ProtectedRoutes;
