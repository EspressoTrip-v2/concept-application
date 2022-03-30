import axios from "axios";

const getUser = async () => {
  return await axios.get('https://employee.acmefast.dev/api/auth/login-success');
};

export default getUser;
