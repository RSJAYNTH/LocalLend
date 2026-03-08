import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
   const { user } = useAuth();

   // If not logged in
   if (!user) {
      return <Navigate to="/login" replace />;
   }

   // If logged in but needs registration (backend profile missing)
   if (user.needsRegistration) {
      return <Navigate to="/register" replace />;
   }

   return <Outlet />;
};

export default PrivateRoute;
