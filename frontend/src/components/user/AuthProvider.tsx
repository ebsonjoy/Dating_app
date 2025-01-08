/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useRefreshTokenMutation } from"../../slices/apiUserSlice";
import { logout } from '../../slices/authSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const [refreshToken] = useRefreshTokenMutation();
console.log('chekked')
  React.useEffect(() => {
    const setupAxiosInterceptor = () => {
      const interceptor = async (error: any) => {
        if (error.response?.status === 401) {
          try {
            await refreshToken().unwrap()
            return Promise.resolve();
          } catch (refreshError) {
            dispatch(logout());
            window.location.href = '/login';
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
  }, [dispatch, refreshToken]);

  return <>{children}</>;
};

export default AuthProvider;