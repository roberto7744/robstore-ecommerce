import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { token, user } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!user || !user.is_staff) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
