import React, { createContext, useState, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGetNotificationQuery } from '../slices/apiUserSlice';


interface Notification {
  type: string;
  message: string;
}
interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  hasSeenPopup: boolean;
  setHasSeenPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
  notifications:[],
  setNotifications: () => {},
  hasSeenPopup: false,
  setHasSeenPopup: () => {},
});

export const useSocketContext = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;

  const { data: userNotifications } = useGetNotificationQuery(userId!, {
    skip: !userId,
  });

  useEffect(() => {
    if (userNotifications) {
      setNotifications(userNotifications);
    }
  }, [userNotifications]);


  useEffect(() => {
    if (userId) {
      const newSocket = io('http://localhost:5000', {
        query: { userId },
      });

      setSocket(newSocket);

      newSocket.on('getOnlineUsers', (users: string[]) => {
        setOnlineUsers(users);
      });

      newSocket.on('notification', (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        newSocket.close();
        setSocket(null);
      };
    }
  }, [userId]);

  

  return (
    <SocketContext.Provider value={{ socket, onlineUsers,notifications,setNotifications, hasSeenPopup, setHasSeenPopup, }}>
      {children}
    </SocketContext.Provider>
  );
};


