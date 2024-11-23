import { Route } from 'react-router-dom';
import App from '../App';

import AdminLandingScreen from '../pages/adminPages/adminLogin';
import AdminDashboardScreen from '../pages/adminPages/adminDashbord';
import UserList from '../pages/adminPages/usersList';
import SubscriptionPlans from '../pages/adminPages/subscriptionPlans';
import AddPlan from '../pages/adminPages/addPlan';
import EditPlan from '../pages/adminPages/editSubscriptionPlan';
import PaymentDetails from '../pages/adminPages/paymentDetails';

const adminRoutes = (
  <Route path="/" element={<App />}>
    <Route path="/admin/Login" element={<AdminLandingScreen />} />
    <Route path="/admin/Dashboard" element={<AdminDashboardScreen />} />
    <Route path="/admin/usersList" element={<UserList />} />
    <Route path="/admin/subscriptionPlans" element={<SubscriptionPlans />} />
    <Route path="/admin/addPlans" element={<AddPlan />} />
    <Route path="/admin/editPlan/:planId" element={<EditPlan />} />
    <Route path="/admin/paymentDetails" element={<PaymentDetails />} />
  </Route>
);

export default adminRoutes;