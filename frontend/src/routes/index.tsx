import { createRoutesFromElements } from 'react-router-dom';
import userRoutes from './userRoutes';
import adminRoutes from './adminRoutes';

const appRoutes = createRoutesFromElements(
  <>
    {userRoutes}
    {adminRoutes}
  </>
);

export default appRoutes;
