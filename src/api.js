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
      setAuthHeaders(token);
      return axios.post('http://192.168.0.11:3111/user/confirmation');
    },
    verifyToken: (token) => {
      setAuthHeaders(token);
      return axios.post('http://192.168.0.11:3111/user/verify_user');
    },
  },
  board: {
    loadAllBoards: (token) => {
      setAuthHeaders(token);
      return axios.get('http://192.168.0.11:3111/board/all');
    },
    createBoard: (token, data) => {
      setAuthHeaders(token);
      console.log('data in api', data);
      return axios.post('http://192.168.0.11:3111/board', data);
    },
    getBoard: (token, id) => {
      setAuthHeaders(token);
      return axios.get(`http://192.168.0.11:3111/board/${id}`);
    },
    updateBoard: (token, id, data) => {
      setAuthHeaders(token);
      return axios.post(`http://192.168.0.11:3111/board/${id}`, data);
    },
    findUsers: (token, email) => {
      setAuthHeaders(token);
      return axios.get(`http://192.168.0.11:3111/board/find_users/${email}`);
    }
  },
};

export default api;
