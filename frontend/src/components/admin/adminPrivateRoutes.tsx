import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../../store";
import { useAdminRefreshTokenMutation } from '../../slices/adminApiSlice';
import { logoutAdmin } from '../../slices/adminAuthSlice';

const AdminPrivateRoute: React.FC = () => {
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);
  const dispatch = useDispatch();
  const [adminRefreshToken] = useAdminRefreshTokenMutation();

  useEffect(() => {
    const verifyToken = async () => {
      if (adminInfo) {
        console.log('private admin route checked the refresh Token')
        try {
          await adminRefreshToken().unwrap();
        } catch (error) {
          console.log(error)
          dispatch(logoutAdmin());
        }
      }
    };

    verifyToken();
    const intervalId = setInterval(verifyToken, 14 * 60 * 1000); 

    return () => clearInterval(intervalId);
  }, [adminRefreshToken, dispatch, adminInfo]);

  return adminInfo ? <Outlet /> : <Navigate to="/admin/Login" replace />;
};

export default AdminPrivateRoute;