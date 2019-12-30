import { login, logout, verifyToken } from './auth/accountingActions';
import { signup, confirmEmail } from './auth/registrationActions';
import { resetPassword, forgotPassword } from './auth/passwordActions';

export default {
  login,
  signup,
  verifyToken,
  forgotPassword,
  resetPassword,
  logout,
  confirmEmail,
};
