import { toast } from 'react-toastify';
import { useStoreState } from 'easy-peasy';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  const userSessionCookie = useStoreState((state) => state.userSessionCookie);
  useEffect(() => {
    if (userSessionCookie === null) {
      toast.error('Please Login to Continue', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });

      navigate('/login');
    }
  }, [userSessionCookie, navigate]);

  const copy = () => {
    navigator.clipboard.writeText(userSessionCookie?.trim());
    toast.info('Cookie copied', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  };
  return (
    <div className='home'>
      <div className='wrapper-home'>
        <div className='home-container'>
          {userSessionCookie ? (
            <div className='home-internal'>
              <h3>
                Please copy and paste the below cookie into Postman to simulate
                request to the other microservices:
              </h3>
              <div className='cookie'>
                <p className='pointer' onClick={() => copy()}>
                  {userSessionCookie}
                </p>
              </div>
              <button className='loginButton copy' onClick={() => copy()}>
                Copy Cookie
              </button>
            </div>
          ) : (
            <div className='home-internal'>
              <h3>You are unathorized to view this page. Please login</h3>
              {setTimeout(() => {
                navigate('/login');
              }, 2000)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
