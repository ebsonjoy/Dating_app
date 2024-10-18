import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store"; // Import RootState for typing

const PrivateRoute: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth); // Type RootState

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
