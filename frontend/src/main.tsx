// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
// import store from './store';
// import { Provider } from 'react-redux';
// import App from './App';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './index.css';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// import HomeScreen from './pages/userPages/homePage';
// import LoginScreen from './pages/userPages/loginPage';
// import RegisterScreen from './pages/userPages/signUpPage';
// import OTPVerification from './pages/userPages/optVerification';
// import UserInformation from './pages/userPages/userInfoSignUp';
// import LandingScreen from './pages/userPages/landingPage';
// import ForgotPasswordRequesting from './pages/userPages/forgotPasswordRequest';
// import ResetPassword from './pages/userPages/resetPassword';
// import ProfileScreen from './pages/userPages/userProfile';
// // import ProfileScreen from './pages/userPages/userProfile';
// import UserSubscription from './pages/userPages/userSubscription';
// import UserPlanDetails from './pages/userPages/userPlanDetails'
// import UserLikes from './pages/userPages/userLikes'
// // import Chat from './pages/chatPages/dummyChat'



// import ChatPage from './pages/messagePage/messagePage'

// // Admin Routes

// import AdminLandingScreen from './pages/adminPages/adminLogin';
// // import AdminSignUPScreen from './pages/adminPages/adminSignUP';
// import AdminDashboardScreen from './pages/adminPages/adminDashbord';
// import UserList from './pages/adminPages/usersList';
// import SubscriptionPlans from './pages/adminPages/subscriptionPlans';
// import AddPlan from './pages/adminPages/addPlan';
// import EditPlan from './pages/adminPages/editSubscriptionPlan';
// import PaymentDetails from './pages/adminPages/paymentDetails';


// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<App />}>
//       <Route index path="/" element={<HomeScreen />} />
//       <Route index path="/landing" element={<LandingScreen/>} />
//       <Route path="/login" element={<LoginScreen />} />
//       <Route path="/register" element={<RegisterScreen />} />
//       <Route path="/verifyOtp" element={<OTPVerification />} />
//       <Route path="/userInfoSignUp" element={<UserInformation />} />
//       <Route path="/forgotPasswordRequesting" element={<ForgotPasswordRequesting />} />
//       <Route path="/reset-password/:token" element={<ResetPassword />} />
//       <Route path="/profile" element={<ProfileScreen/>} />
//       <Route path="/userSubscription" element={<UserSubscription/>} />
//       <Route path="/userPlanDetails" element={<UserPlanDetails/>} />
//       <Route path="/userLikes" element={<UserLikes/>} />
//       {/* <Route path="/chat" element={<Chat/>} /> */}

//       <Route path="/chat"element={<ChatPage/>} />











//       {/* ADMIN SIDE */}

//       <Route  path="/admin/Login" element={<AdminLandingScreen/>} />
//       {/* <Route index path="/adminSignUP" element={<AdminSignUPScreen/>} /> */}
//       <Route  path="/admin/Dashboard" element={<AdminDashboardScreen/>} />
//       <Route  path="/admin/usersList" element={<UserList/>} />

//       <Route  path="/admin/subscriptionPlans" element={<SubscriptionPlans/>} />
//       <Route  path="/admin/addPlans" element={<AddPlan/>} />
//       <Route  path="/admin/editPlan/:planId" element={<EditPlan/>} />
//       <Route  path="/admin/paymentDetails" element={<PaymentDetails/>} />




      





//     </Route>
//   )
// );



// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <Provider store={store}>
//     <GoogleOAuthProvider clientId="107022301338-q6fc28r4llhv23cen8mch1lhm15tvuu9.apps.googleusercontent.com">
//       <React.StrictMode>
//         <RouterProvider router={router} />
//       </React.StrictMode>
//     </GoogleOAuthProvider>
//   </Provider>
// );



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
import { SocketProvider } from './context/socketContext';
// import { VideoCallProvider } from './context/VideoCallContext';


const router = createBrowserRouter(appRoutes);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="107022301338-q6fc28r4llhv23cen8mch1lhm15tvuu9.apps.googleusercontent.com">
      <React.StrictMode>
      <AuthProvider>
        <SocketProvider>
          {/* <VideoCallProvider> */}
        <RouterProvider router={router} />
        {/* </VideoCallProvider> */}
        </SocketProvider>
        </AuthProvider>
      </React.StrictMode>
    </GoogleOAuthProvider>
  </Provider>
);
