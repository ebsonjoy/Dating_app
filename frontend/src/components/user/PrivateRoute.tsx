import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../../store";
import { useRefreshTokenMutation } from"../../slices/apiUserSlice";
import { logout } from '../../slices/authSlice';

const PrivateRoute: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    const verifyToken = async () => {
      if (userInfo) {
        console.log('private route checked the refresh Token')
        try {
          await refreshToken().unwrap();
        } catch (error) {
          console.log(error)
          dispatch(logout());
        }
      }
    };

    verifyToken();
    const intervalId = setInterval(verifyToken, 14 * 60 * 1000); 

    return () => clearInterval(intervalId);
  }, [refreshToken, dispatch, userInfo]);

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;