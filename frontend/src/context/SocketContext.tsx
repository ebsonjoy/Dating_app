import React, { createContext, useState, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useLogoutMutation } from '../slices/apiUserSlice';
import { logout } from '../slices/authSlice';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const useSocketContext = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (userId) {
      const newSocket = io('http://localhost:5000', {
        query: { userId },
      });

      setSocket(newSocket);

      newSocket.on('getOnlineUsers', (users: string[]) => {
        setOnlineUsers(users);
      });

      newSocket.on('forceLogout',async () => {
       try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            window.location.href = '/login';
          } catch (error) {
            console.error('Error during forced logout:', error);
          }
      });

      return () => {
        newSocket.close();
        setSocket(null);
      };
    }
  }, [dispatch, logoutApiCall, userId]);

  

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};


