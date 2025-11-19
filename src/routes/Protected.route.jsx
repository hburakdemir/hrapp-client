import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {jwtDecode} from "jwt-decode";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userRole = decoded.role;

      // Eğer allowedRoles verilmişse ve kullanıcı yetkili değilse
      if (allowedRoles && !allowedRoles.includes(userRole)) {
        navigate("/unauthorized", { replace: true });
        return;
      }

    } catch (error) {
      console.error("JWT decode error:", error);
      navigate("/login", { replace: true });
    }

  }, [token, navigate, allowedRoles]);

  if (!token) return null;

  return children;
}
