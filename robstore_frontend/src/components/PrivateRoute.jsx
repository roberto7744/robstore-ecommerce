import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { token, user } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user?.is_staff) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
