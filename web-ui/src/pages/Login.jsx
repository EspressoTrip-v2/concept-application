import Google from '../img/google.png';
import Facebook from '../img/facebook.png';
import Github from '../img/github.png';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import getUser from '../helpers';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const userAuthorised = useStoreState((state) => state.userAuthorised);
  const setUserAuthorised = useStoreActions(
    (actions) => actions.setUserAuthorised
  );
  const setUser = useStoreActions((actions) => actions.setUser);

  const [loading, setLoading] = useState(false);

  const userStatus = async () => {
    const result = await getUser();
    await setUserAuthorised(result);
    return result;
  };

  useLayoutEffect(() => {
    userStatus();
    if (userAuthorised) {
      navigate('/');
    }
  }, [userAuthorised]);

  useEffect(() => {
    if (userAuthorised) {
      navigate('/');
    }
  }, []);

  const [input, setInput] = useState({ email: '', password: '' });

  const google = async () => {
    setLoading(true);
    window.open('https://acmefast.dev/api/auth/connect/google', '_self');
  };

  const github = () => {
    setLoading(true);
    window.open('https://acmefast.dev/api/auth/connect/github', '_self');
  };

  const handleOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const req = await axios.post('/api/auth/local', {
        email: input.email,
        password: input.password,
      });

      if (req.status === 200) {
        setUserAuthorised(true);
        setLoading(false);
        navigate('/');
      }
    } catch (error) {
      setLoading(false);
      const parsedError = JSON.parse(JSON.stringify(error));

      let errMsg;
      if (parsedError.status === 401) errMsg = 'Invalid Credentials';
      if (parsedError.status === 404) errMsg = 'User Not Found';

      toast.error(errMsg, {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className='w-md-50 w-100 d-flex justify-content-center align-items-center flex-lg-row justify-content-lg-evenly flex-column m-auto mt-5 '>
      <div className='d-flex justify-content-center flex-column text-center'>
        <img
          className='login-img'
          src='./assets/acmefast.svg'
          width='100%'
          height='210px'
          alt='ACME'
        />
      </div>
      <div className='text-center'>
        <h2 className='card-title mt-5'>Authentication</h2>
        <p className='card-text'>Please login to continue</p>
        <form
          className='w-100 d-flex justify-content-center align-items-center'
          onSubmit={handleLogin}
        >
          <div>
            <input
              className='w-100 form-control'
              required
              name='email'
              type='email'
              placeholder='Email'
              onChange={handleOnChange}
            />
            <input
              className='w-100 form-control mt-2 mb-2'
              required
              name='password'
              type='password'
              placeholder='Password'
              onChange={handleOnChange}
            />
            <button
              className='w-100 btn btn-primary w-100'
              disabled={loading}
              type='submit'
            >
              Sign In
            </button>
          </div>
        </form>
        <h5 className='m-3 text-center '>
          Or sign in with one of these methods
        </h5>

        <div className='d-flex align-content-center justify-content-center'>
          <button
            disabled={loading}
            className='btn btn-danger m-3'
            onClick={google}
          >
            <img src={Google} alt='Google' className='icon' />
          </button>
          <button disabled={loading} className='btn btn-primary m-3'>
            <img src={Facebook} alt='Facebook' className='icon' />
          </button>
          <button
            disabled={loading}
            className='btn btn-dark m-3'
            onClick={github}
          >
            <img src={Github} alt='GitHub' className='icon' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
