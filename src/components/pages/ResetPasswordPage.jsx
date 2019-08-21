import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../styles/resetPasswordPage.sass';
import Loader from '../utils/Loader';
import actions from '../../actions/authActions';
import Messages from '../utils/Messages';
import ResetPasswordForm from '../forms/authForms/ResetPasswordForm';


const propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      resetToken: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  resetPassword: PropTypes.func.isRequired,
};


class ResetPasswordPage extends Component {
  state = {
    userData: {
      password: '',
      confirmPassword: '',
    },
    status: {
      success: {
        statusCode: undefined,
        message: '',
      },
      err: {
        statusCode: undefined,
        message: '',
      },
      loading: false,
    },
  }

  onChange = (e) => {
    const { target } = e;

    this.setState(state => ({
      ...state,
      userData: {
        ...state.userData,
        [target.name]: target.value,
      },
    }));
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { state, validate, props } = this;
    const message = validate(state.userData);
    const token = props.match.params.resetToken;

    if (message) {
      this.setState(prevState => ({
        ...prevState,
        status: {
          ...prevState.status,
          err: {
            message,
            statusCode: undefined,
          },
        },
      }));
      return;
    }

    props.resetPassword({ ...state.userData, token })
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          userData: {
            password: '',
            confirmPassword: '',
          },
          status: {
            loading: false,
            err: {
              message: '',
              statusCode: undefined,
            },
            success: {
              statusCode: res.status,
              message: res.data.message,
            },
          },
        }));
      })
      .catch((err) => {
        this.setState(prevState => ({
          ...prevState,
          status: {
            ...prevState.status,
            loading: false,
            err: {
              statusCode: err.status,
              message: err.message,
            },
          },
        }));
      });

    this.setState(prevState => ({
      ...prevState,
      status: {
        ...prevState.status,
        loading: true,
      },
    }));
  }

  validate = ({ password, confirmPassword }) => {
    if (password.length < 8) {
      return 'Password is too short';
    }
    if (password !== confirmPassword) {
      return 'Confirmed password doesn\'t match to password';
    }

    return '';
  }

  // Close info message and reset seccess and err state
  closeMessage = () => {
    const { state, props } = this;
    const { success } = state.status;

    if (success.statusCode === 200) {
      props.history.push('/');
      return;
    }

    this.setState(prevState => ({
      ...prevState,
      status: {
        ...prevState.status,
        success: {
          statusCode: undefined,
          message: '',
        },
        err: {
          statusCode: undefined,
          message: '',
        },
      },
    }));
  }

  render() {
    const {
      state,
      onChange,
      onSubmit,
      closeMessage,
    } = this;

    return (
      <div className="container mb-4">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-xs-12 col-sm-12 col-md-6 col-l-4 col-xl-4 px-0 text-center">
            <h2 className="bg-primary mb-0 py-1">Reset password</h2>
            <ResetPasswordForm formMethods={{ onChange, onSubmit }} userData={state.userData} />
            {state.status.loading && <Loader.FormLoader bgStyles={{ top: '0px' }} />}
            {state.status.err.message && <Messages.ErrorMessage message={state.status.err.message} closeMessage={closeMessage} />}
            {state.status.success.message && <Messages.SuccessMessage message={state.status.success.message} closeMessage={closeMessage} />}
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resetPassword: userData => dispatch(actions.resetPassword(userData)),
});


ResetPasswordPage.propTypes = propTypes;


export default connect(null, mapDispatchToProps)(ResetPasswordPage);
