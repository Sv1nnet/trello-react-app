// React/Redux components
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// Custom components
import SignupForm from '../forms/authForms/SignupForm';
import LoginForm from '../forms/authForms/LoginForm';
import ResetPasswordForm from '../forms/authForms/ForgotPasswordForm';
import AuthFormHolder from '../pages/AuthFormHolder';
import Messages from '../utils/Messages';


const propTypes = {
  routeInfo: PropTypes.shape({
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};


class AuthNav extends Component {
  constructor(props) {
    super(props);

    this.formContainer = React.createRef();
  }

  state = {
    isSignupButtonActive: true,
    isLoginButtonActive: false,
    resetPassword: false,
    isPopupOpened: false,
    formHeight: '',
  }

  componentDidMount() {
    const { routeInfo } = this.props;
    const { pathname } = routeInfo.location;
    if (pathname === '/user/forgot_password') {
      routeInfo.history.push('/');
      this.switchForm({ resetPassword: true });
    }
  }

  openAboutPopup = () => {
    this.setState(state => ({
      ...state,
      isPopupOpened: !state.isPopupOpened,
    }));
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
  setFormHeight = (height = 0) => {
    const { formContainer } = this;
    const formMarginInPixels = 58;
    const selfHeight = formContainer.current.children[0].offsetHeight + formMarginInPixels;

    this.setState(state => ({
      ...state,
      formHeight: `${selfHeight + height}px`,
    }));
  }

  // Get AuthFormHolder with a form that we need to render as authProp and render it in AuthFormHolder as children
  getForm = () => {
    const { isSignupButtonActive, isLoginButtonActive, resetPassword } = this.state;
    let Form;

    if (isSignupButtonActive) Form = SignupForm;
    if (isLoginButtonActive) Form = LoginForm;
    if (resetPassword) Form = ResetPasswordForm;

    return (
      <AuthFormHolder setFormHeight={this.setFormHeight} authForm={Form} switchForm={this.switchForm} />
    );
  }

  render() {
    const {
      isSignupButtonActive,
      isLoginButtonActive,
      isPopupOpened,
      formHeight,
    } = this.state;
    const height = formHeight;
    const authForm = this.getForm();

    return (
      <div className="container auth-page mb-3">
        <div className="row justify-content-center">
          <div
            ref={this.formContainer}
            style={{ height }}
            className="col-xs-12 col-sm-12 col-md-6 col-l-4 col-xl-4 text-center auth-forms-container"
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

        <div className="auth-page__about-btn-container">
          <button
            type="button"
            onClick={this.openAboutPopup}
            className="auth-page__about-btn"
          >
            <h4>About</h4>
          </button>
        </div>

        {
          isPopupOpened && ReactDOM.createPortal(
            <Messages.InfoMessage
              title="About this app"
              message={(
                <span className="auth-page__message-description">
                  This is my study project that I created for my portfolio and to learn React, Redux and some back-end technologies.
                  The app has been published for review and not for real use purpose.
                  You can find source code on my <a href="https://github.com/Sv1nnet/trello-react-app" rel="noopener noreferrer" target="_blank">GitHub</a>.
                </span>
              )}
              styles={{ marginTop: '-20%' }}
              bgPosition="fixed"
              closeMessage={this.openAboutPopup}
              bg
              btn
            />,
            document.body,
          )
        }
      </div>
    );
  }
}


AuthNav.propTypes = propTypes;


export default AuthNav;
