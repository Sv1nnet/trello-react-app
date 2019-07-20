import React, { Component } from 'react';
import SignupForm from '../forms/SignupForm';
import LoginForm from '../forms/LoginForm';
import ResetPasswordForm from '../forms/ResetPasswordForm';
import AuthFormHolder from '../pages/AuthFormHolder';

class AuthNav extends Component {
  state = {
    isSignupButtonActive: true,
    isLoginButtonActive: false,
    resetPassword: false,
  }

  componentDidMount() {
    const { routeInfo } = this.props;
    const { pathname } = routeInfo.location;
    if (pathname === '/user/forgot_password') {
      routeInfo.history.push('/');
      this.switchForm({ resetPassword: true });
    }
  }

  // Switch a form that we need render
  switchForm = ({ resetPassword, isSignupButtonActive, isLoginButtonActive }) => {
    this.setState(state => ({
      ...state,
      resetPassword: !!resetPassword,
      isSignupButtonActive: !!isSignupButtonActive,
      isLoginButtonActive: !!isLoginButtonActive,
    }));
  }

  // Get form height to make smooth increase height
  getFormHeight = () => {
    const { isSignupButtonActive, isLoginButtonActive, resetPassword } = this.state;

    if (isSignupButtonActive) return '546px';
    if (isLoginButtonActive) return '303px';
    if (resetPassword) return '200px';

    return '100%';
  }

  // Get AuthFormHolder with a form that we need to render as authProp and render it in AuthFormHolder as children
  getForm = () => {
    const { isSignupButtonActive, isLoginButtonActive, resetPassword } = this.state;
    let Form;

    if (isSignupButtonActive) Form = SignupForm;
    if (isLoginButtonActive) Form = LoginForm;
    if (resetPassword) Form = ResetPasswordForm;

    return (
      <AuthFormHolder authForm={Form} switchForm={this.switchForm} />
    );
  }

  render() {
    const { isSignupButtonActive, isLoginButtonActive } = this.state;
    const height = this.getFormHeight();
    const authForm = this.getForm();

    return (
      <div className="container auth-page">
        <div className="row justify-content-center">
          <div
            style={{ height }}
            className="col-xs-12 col-sm-12 col-md-5 col-l-4 col-xl-4 text-center auth-forms-container"
          >
            <div className="row">

              <button
                type="button"
                onClick={() => { this.switchForm({ isSignupButtonActive: true }); }}
                className={`col-6 auth-nav-button ${isSignupButtonActive && 'active'}`}
                disabled={isSignupButtonActive}
              >Sign up
              </button>

              <button
                type="button"
                onClick={() => { this.switchForm({ isLoginButtonActive: true }); }}
                className={`col-6 auth-nav-button ${isLoginButtonActive && 'active'}`}
                disabled={isLoginButtonActive}
              >Log in
              </button>
            </div>

            {authForm}
          </div>
        </div>
      </div>
    );
  }
}

export default AuthNav;
