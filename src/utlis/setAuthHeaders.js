import axios from 'axios';

/**
 * Set Authorization header as "Bearer `${token}`" or delete this head if token hasn't passed in arguments
 * @param {string} [token=null] user token
 */
const setAuthHeaders = (token = null) => {
  if (token) {
    axios.defaults.headers.common.authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.authorization;
  }
};

export default setAuthHeaders;
