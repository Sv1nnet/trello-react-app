import axios from 'axios';
import setAuthHeaders from './utlis/setAuthHeaders';

const ip = 'http://192.168.0.16:3111';
const api = {
  auth: {
    signup: (data) => {
      setAuthHeaders();
      return axios.post(`${ip}/user/signup`, data);
    },
    login: (data) => {
      setAuthHeaders();
      return axios.post(`${ip}/user/login`, data);
    },
    logout: (token) => {
      setAuthHeaders(token);
      return axios.post(`${ip}/user/logout`);
    },
    forgotPassword: (data) => {
      setAuthHeaders();
      return axios.post(`${ip}/user/forgot_password`, data);
    },
    resetPassword: (token, data) => {
      setAuthHeaders(token);
      return axios.post(`${ip}/user/reset_password`, data);
    },
    confirmEmail: (token) => {
      setAuthHeaders(token);
      return axios.post(`${ip}/user/confirmation`);
    },
    verifyToken: (token) => {
      setAuthHeaders(token);
      return axios.post(`${ip}/user/verify_user`);
    },
  },
  board: {
    loadAllBoards: (token) => {
      setAuthHeaders(token);
      return axios.get(`${ip}/board/all`);
    },
    createBoard: (token, data) => {
      setAuthHeaders(token);
      return axios.post(`${ip}/board`, data);
    },
    getBoard: (token, boardId) => {
      setAuthHeaders(token);
      return axios.get(`${ip}/board/${boardId}`);
    },
    updateBoard: (token, boardId, data) => {
      setAuthHeaders(token);
      return axios.post(`${ip}/board/${boardId}`, data);
    },
    findUsers: (token, email) => {
      setAuthHeaders(token);
      return axios.get(`${ip}/board/find_users/${email}`);
    },
    getMembers: (token, boardId) => {
      setAuthHeaders(token);
      return axios.get(`${ip}/board/${boardId}/get_members`);
    },
    addMember: (token, boardId, data) => {
      setAuthHeaders(token);
      return axios.post(`${ip}/board/${boardId}/add_member`, data);
    },
    removeMember: (token, boardId, data) => {
      setAuthHeaders(token);
      return axios.post(`${ip}/board/${boardId}/remove_member`, data);
    },
    createColumn: (token, boardId, data) => {
      setAuthHeaders(token);
      return axios.post(`${ip}/board/${boardId}/create_column`, data);
    },
    updateColumn: (token, boardId, columnId, data) => {
      setAuthHeaders(token);
      return axios.post(`${ip}/board/${boardId}/update_column/${columnId}`, data);
    },
    updateColumnPositions: (token, boardId, data) => {
      setAuthHeaders(token);
      return axios.post(`${ip}/board/${boardId}/update_column_positions`, data);
    },
    deleteColumn: (token, boardId, columnId) => {
      setAuthHeaders(token);
      return axios.post(`${ip}/board/${boardId}/delete_column/${columnId}`);
    },
    createCard: (token, boardId, columnId, data) => {

    },
  },
};

export default api;
