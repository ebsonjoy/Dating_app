/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useRefreshTokenMutation } from '../../slices/apiUserSlice';
import { useAdminRefreshTokenMutation } from '../../slices/adminApiSlice';
import { RootState } from '../../store';
import { logout } from '../../slices/authSlice';
import { logoutAdmin } from '../../slices/adminAuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [refreshToken] = useRefreshTokenMutation();
  const [adminRefreshToken] = useAdminRefreshTokenMutation();

  React.useEffect(() => {
    const setupAxiosInterceptor = () => {
      const interceptor = async (error: any) => {
        if (error.response?.status === 401) {
          try {
            const isAdminRequest = error.config.url.includes('/admin');
            if (isAdminRequest && adminInfo) {
              await adminRefreshToken().unwrap();
            } else if (userInfo) {
              await refreshToken().unwrap();
            }
            return Promise.resolve();
          } catch (refreshError) {
            if (adminInfo) {
              dispatch(logoutAdmin());
              window.location.href = '/admin/Login';
            } else if (userInfo) {
              dispatch(logout());
              window.location.href = '/login'
            }
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      };

      const id = axios.interceptors.response.use(
        (response) => response,
        interceptor
      );

      return () => {
        axios.interceptors.response.eject(id);
      };
    };

    const cleanup = setupAxiosInterceptor();
    return () => cleanup();
  }, [dispatch, refreshToken, adminRefreshToken, adminInfo, userInfo]);

  return <>{children}</>;
};

export default AuthProvider;