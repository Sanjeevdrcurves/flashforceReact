import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/loaders';
import { useAuthContext } from './useAuthContext';
import { useSelector } from 'react-redux';
const RequireAuth = () => {
  const {userToken}  = useSelector(state => state.AuthReducerKey);
  const {
    auth,
    loading
  } = useAuthContext();
  const location = useLocation();
  if (loading) {
    return <ScreenLoader />;
  }
  return userToken ? <Outlet /> : <Navigate to="/auth/login" state={{
    from: location
  }} replace />;
};
export { RequireAuth };