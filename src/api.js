import axios from 'axios';
import setAuthHeaders from './utlis/setAuthHeaders';

const api = {
  auth: {
    signup: (data) => {
      setAuthHeaders();
      return axios.post('http://192.168.0.11:3111/user/signup', data);
    },
    login: (data) => {
      setAuthHeaders();
      return axios.post('http://192.168.0.11:3111/user/login', data);
    },
    logout: (token) => {
      setAuthHeaders(token);
      return axios.post('http://192.168.0.11:3111/user/logout');
    },
    forgotPassword: (data) => {
      setAuthHeaders();
      return axios.post('http://192.168.0.11:3111/user/forgot_password', data);
    },
    resetPassword: (token, data) => {
      setAuthHeaders(token);
      return axios.post('http://192.168.0.11:3111/user/reset_password', data);
    },
    confirmEmail: (token) => {
      console.log('api token', token);
      setAuthHeaders(token);
      return axios.post('http://192.168.0.11:3111/user/confirmation');
    },
    validateToken: (token) => {
      setAuthHeaders(token);
      return axios.post('http://192.168.0.11:3111/user/validate_token');
    },
  },

};

export default api;
