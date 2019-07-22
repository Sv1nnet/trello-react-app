import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../styles/resetPasswordPage.sass';
import Loader from '../utils/Loader';
import actions from '../../actions/authActions';
import Messages from '../utils/Messages';

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
            statusCode: undefined,
            message,
          },
        },
      }));
      return;
    }

    props.resetPassword({ ...state.userData, token }).then((response) => {
      if (response) {
        if (response.status === 200) {
          const responseMessage = response.data.message;

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
                statusCode: 200,
                message: responseMessage,
              },
            },
          }));
        } else {
          const { err } = response.data;

          this.setState(prevState => ({
            ...prevState,
            status: {
              loading: false,
              err: {
                message: err,
                statusCode: response.data.status,
              },
              success: {
                statusCode: undefined,
                message: '',
              },
            },
          }));
        }
      } else { // Set error if no response from server
        this.setState(prevState => ({
          ...prevState,
          status: {
            ...prevState.status,
            loading: false,
            err: {
              statusCode: 503,
              message: 'No connection with the server',
            },
          },
        }));
      }
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
      return 'Password and confirmed password are different';
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
            <form action="" onSubmit={onSubmit} className="reset-password px-15">

              <label htmlFor="password" className="d-block w-100">
                <input onChange={onChange} type="password" name="password" id="password" className="w-100 px-2" value={state.userData.password} />
                <span className="form-label-text">Password</span>
              </label>

              <label htmlFor="confirmPassword" className="d-block w-100">
                <input onChange={onChange} type="password" name="confirmPassword" id="confirmPassword" className="w-100 px-2" value={state.userData.confirmPassword} />
                <span className="form-label-text">Confirm password</span>
              </label>

              <button type="submit" className="btn btn-primary btn-block my-4">Reset password</button>
            </form>
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

export default connect(null, mapDispatchToProps)(ResetPasswordPage);
