import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import appRoutes from './routes/index';
import AuthProvider from './components/user/AuthProvider'
import { SocketProvider } from './context/SocketContext';

const router = createBrowserRouter(appRoutes);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="107022301338-q6fc28r4llhv23cen8mch1lhm15tvuu9.apps.googleusercontent.com">
      <React.StrictMode>
      <AuthProvider>
        <SocketProvider>
        <RouterProvider router={router} />
        </SocketProvider>
        </AuthProvider>
      </React.StrictMode>
    </GoogleOAuthProvider>
  </Provider>
);
