import Google from '../img/google.png';
import Facebook from '../img/facebook.png';
import Github from '../img/github.png';
import { useLayoutEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import getUser from '../helpers';

const Login = () => {
  const navigate = useNavigate();
  const userSessionCookie = useStoreState((state) => state.userSessionCookie);
  useLayoutEffect(() => {
    if (userSessionCookie) {
      navigate('/');
    }
  }, [userSessionCookie, navigate]);
  const updateUserSessionCookie = useStoreActions(
    (actions) => actions.updateUserSessionCookie
  );

  const [input, setInput] = useState({ email: '', password: '' });

  const google = () => {
    window.open('https://acmefast.dev/api/auth/connect/google', '_self');
  };

  const github = () => {
    window.open('https://acmefast.dev/api/auth/connect/github', '_self');
  };

  const handleOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email: input.email,
      password: input.password,
    };
    await axios.post('/api/auth/local', user).then(async () => {
      const userCookie = await getUser();
      await updateUserSessionCookie(userCookie);
    });
  };

  return (
    <div className='login'>
      <h1 className='loginTitle'>Method</h1>
      <div className='wrapper'>
        <div className='left'>
          <button className='loginButton google' onClick={google}>
            <img src={Google} alt='' className='icon' />
            Google
          </button>
          <button className='loginButtonDisabled facebook' disabled>
            <img src={Facebook} alt='' className='icon' />
            Facebook
          </button>
          <button className='loginButton github' onClick={github}>
            <img src={Github} alt='' className='icon' />
            Github
          </button>
        </div>
        <div className='center'>
          <div className='line' />
          <div className='or'>OR</div>
        </div>
        <form className='right' onSubmit={onSubmit}>
          <div className='right'>
            <input
              required
              name='email'
              type='email'
              placeholder='Email'
              onChange={handleOnChange}
            />
            <input
              required
              name='password'
              type='password'
              placeholder='Password'
              onChange={handleOnChange}
            />

            <button className='submit' type='submit'>
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
