// import { Route } from 'react-router-dom';
// import App from '../App';

// import HomeScreen from '../pages/userPages/homePage';
// import LoginScreen from '../pages/userPages/loginPage';
// import RegisterScreen from '../pages/userPages/signUpPage';
// import OTPVerification from '../pages/userPages/optVerification';
// import UserInformation from '../pages/userPages/userInfoSignUp';
// import LandingScreen from '../pages/userPages/landingPage';
// import ForgotPasswordRequesting from '../pages/userPages/forgotPasswordRequest';
// import ResetPassword from '../pages/userPages/resetPassword';
// import ProfileScreen from '../pages/userPages/userProfile';
// import UserSubscription from '../pages/userPages/userSubscription';
// import UserPlanDetails from '../pages/userPages/userPlanDetails';
// import UserLikes from '../pages/userPages/userLikes';
// import ChatPage from '../pages/messagePage/messagePage';

// const userRoutes = (
//   <Route path="/" element={<App />}>
//     <Route index path="/" element={<HomeScreen />} />
//     <Route path="/landing" element={<LandingScreen />} />
//     <Route path="/login" element={<LoginScreen />} />
//     <Route path="/register" element={<RegisterScreen />} />
//     <Route path="/verifyOtp" element={<OTPVerification />} />
//     <Route path="/userInfoSignUp" element={<UserInformation />} />
//     <Route path="/forgotPasswordRequesting" element={<ForgotPasswordRequesting />} />
//     <Route path="/reset-password/:token" element={<ResetPassword />} />
//     <Route path="/profile" element={<ProfileScreen />} />
//     <Route path="/userSubscription" element={<UserSubscription />} />
//     <Route path="/userPlanDetails" element={<UserPlanDetails />} />
//     <Route path="/userLikes" element={<UserLikes />} />
//     <Route path="/chat" element={<ChatPage />} />
//   </Route>
// );

// export default userRoutes;

import { Route } from 'react-router-dom';
import App from '../App';
import PrivateRoute from '../components/user/PrivateRoute'





// Public routes
import LandingScreen from '../pages/userPages/landingPage';
import LoginScreen from '../pages/userPages/loginPage';
import RegisterScreen from '../pages/userPages/signUpPage';
import OTPVerification from '../pages/userPages/optVerification';
import ForgotPasswordRequesting from '../pages/userPages/forgotPasswordRequest';
import ResetPassword from '../pages/userPages/resetPassword';

// Protected routes
import HomeScreen from '../pages/userPages/homePage';
import UserInformation from '../pages/userPages/userInfoSignUp';
import ProfileScreen from '../pages/userPages/userProfile';
import UserSubscription from '../pages/userPages/userSubscription';
import UserPlanDetails from '../pages/userPages/userPlanDetails';
import UserLikes from '../pages/userPages/userLikes';
// import ChatPage from '../pages/messagePage/messagePage';
// import ChatPage from '../pages/userPages/ChatPage'
import NotFound from '../components/user/notFoundPage';

import MessagesPage from '../pages/userPages/messagePage';


const userRoutes = (
  
  <Route path="/" element={<App />}>
    {/* Public Routes */}
    <Route path="/landing" element={<LandingScreen />} />
    <Route path="/login" element={<LoginScreen />} />
    <Route path="/register" element={<RegisterScreen />} />
    <Route path="/verifyOtp" element={<OTPVerification />} />
    <Route path="/forgotPasswordRequesting" element={<ForgotPasswordRequesting />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />

    {/* Protected Routes */}
    <Route element={<PrivateRoute />}>
      <Route index path="/" element={<HomeScreen />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/userInfoSignUp" element={<UserInformation />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/userSubscription" element={<UserSubscription />} />
      <Route path="/userPlanDetails" element={<UserPlanDetails />} />
      <Route path="/userLikes" element={<UserLikes />} />
      {/* <Route path="/chat/:partnerUserId" element={<ChatPage />} /> */}
      <Route path="/message" element={<MessagesPage />} />



    </Route>
  </Route>
);

export default userRoutes;