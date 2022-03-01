import { Link } from 'react-router-dom';
import axios from 'axios';
import { useStoreState, useStoreActions } from 'easy-peasy';

const Navbar = () => {
  const userSessionCookie = useStoreState((state) => state.userSessionCookie);
  const updateUserSessionCookie = useStoreActions(
    (actions) => actions.updateUserSessionCookie
  );

  const signOut = async () => {
    await axios.post('/api/auth/signout');
    await updateUserSessionCookie(null);
  };
  return (
    <div className='navbar'>
      <span className='logo'>
        <Link className='link' to='/'>
          Microservice Authentication
        </Link>
      </span>
      {userSessionCookie && (
        <button className='link-button' onClick={signOut}>
          Sign Out
        </button>
      )}
    </div>
  );
};

export default Navbar;
