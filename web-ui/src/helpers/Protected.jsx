import { useStoreState } from 'easy-peasy';
import { Outlet } from 'react-router';
import Login from '../pages/Login';

const useAuth = () => {
  const userAuthorised = useStoreState((state) => state.userAuthorised);
  return userAuthorised;
};

const Protected = () => {
  const isAuthorised = useAuth();

  return isAuthorised ? <Outlet /> : <Login />;
};

export default Protected;
