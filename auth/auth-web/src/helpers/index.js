import axios from 'axios';

const getUser = async () => {
  const result = await axios.get('https://acmefast.dev/api/auth/login-success');
  return result.data.session;
};

export default getUser;
