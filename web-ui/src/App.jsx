import './app.css';
import { useStoreActions } from 'easy-peasy';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { toast } from 'react-toastify';
import getUser from './helpers';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

const App = () => {
  const updateUserSessionCookie = useStoreActions(
    (actions) => actions.updateUserSessionCookie
  );

  useLayoutEffect(() => {
    const doUserData = async () => {
      const session = await getUser();
      await updateUserSessionCookie(session);
    };
    doUserData();
  }, [updateUserSessionCookie]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
