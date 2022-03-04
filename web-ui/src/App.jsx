import './app.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Protected from './helpers/Protected';
toast.configure();

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<Protected />} path='/'>
          <Route path='/' element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
