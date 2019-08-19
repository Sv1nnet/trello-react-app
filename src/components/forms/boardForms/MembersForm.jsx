/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../../utils/TextInput';
import Loader from '../../utils/Loader';
import actions from '../../../actions/boardActions';
import Messages from '../../utils/Messages';

class MembersForm extends Component {
  state = {
    inputValue: '',
    getUsersInterval: undefined,
    status: {
      loading: false,
      success: {
        message: '',
        data: undefined,
        statusCode: undefined,
      },
      err: {
        message: '',
        statusCode: undefined,
      },
    },
  }

  handleChange = (e) => {
    const { target } = e;
    const { inputValue, timeout } = this.state;

    clearTimeout(timeout);
    this.setState(state => ({
      ...state,
      inputValue: target.value,
    }),
    () => { this.findUsers(inputValue); });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.findUsers();
  }

  clearInput = () => {
    this.setState(state => ({
      ...state,
      inputValue: '',
      status: {
        loading: false,
        success: {
          message: '',
          data: undefined,
          statusCode: undefined,
        },
        err: {
          message: '',
          statusCode: undefined,
        },
      },
    }));
  }

  findUsers = () => {
    const { findUsers, token } = this.props;
    const { inputValue } = this.state;

    if (inputValue) {
      const timeout = setTimeout(() => {
        findUsers(token.token, inputValue)
          .then((data) => {
            this.setState(state => ({
              ...state,
              status: {
                ...state.status,
                loading: false,
                success: {
                  message: 'Users laoded',
                  data: data.data.users,
                  statusCode: 200,
                },
              },
            }));
          })
          .catch((err) => {
            this.setState(state => ({
              ...state,
              status: {
                ...state.status,
                loading: false,
                err: {
                  message: err.message,
                  statusCode: err.status,
                },
              },
            }));
          });

        this.setState(state => ({
          ...state,
          timeout,
          status: {
            ...state.status,
            loading: true,
          },
        }));
      }, 500);

      this.setState(state => ({
        ...state,
        timeout,
      }));
    } else {
      this.setState(state => ({
        ...state,
        status: {
          ...state.status,
          success: {
            message: '',
            data: undefined,
            statusCode: undefined,
          },
        },
      }));
    }
  }

  closeMessage = (clearInput) => {
    console.log(clearInput);
    this.setState(state => ({
      ...state,
      status: {
        ...state.status,
        err: {
          message: '',
          statusCode: undefined,
        },
      },
    }));
  }

  render() {
    const { members } = this.props;
    const { inputValue, status } = this.state;
    const users = status.success.statusCode === 200 ? status.success.data : members;

    return (
      <form action="" onSubmit={this.handleSubmit} className="w-100">
        <span className="popup-title text-dark">Members</span>

        <div className="input-container">
          <label htmlFor="titlename">Find user</label>
          <TextInput
            onChange={this.handleChange}
            onFocus={this.onFoc}
            onCrossBtnClick={this.clearInput}
            inputValue={inputValue}
            classList="members-board-input"
            name="titlename"
            id="titlename"
            placeholder="Find user by email"
            focuseAfterCleared
            selectOnMounted
          />
        </div>

        <ul className="list-group user-list">

          {users.length > 0
            ? users.map(user => (
              <li key={user.email} className="list-group-item d-flex align-items-center user-list-item">

                <div className="user-logo-container">
                  <span className="p-0 ml-1 text-primary rounded-circle bg-white text-center font-weight-bold user-logo">{(`${user.nickname[0]}${user.nickname[1]}`).toUpperCase()}</span>
                </div>

                <div className="credentials-container">
                  <div className="credentials-email-container">
                    <span className="credentials-nickname">
                      {user.nickname}
                    </span>
                  </div>
                  <div className="credentails-nickname-container">
                    <span className="credentials-email">
                      {user.email}
                    </span>
                  </div>
                </div>

                <div className="member-controls">
                  <button type="button" className="member-control-btn btn btn-sm btn-danger">
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

              </li>
            ))
            : <h5 className="text-center text-danger">No users found</h5>}
        </ul>

        {status.err.message && <Messages.ErrorMessage message={status.err.message} closeMessage={this.closeMessage} />}

        {status.loading && (
          <div className="position-relative py-3">
            <Loader.FormLoader />
          </div>
        )}
      </form>
    );
  }
}

MembersForm.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
  })).isRequired,
  token: PropTypes.shape({
    access: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired,
  findUsers: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  token: state.user.token,
});

const mapDispatchToProps = dispatch => ({
  findUsers: (token, email) => dispatch(actions.findUsers(token, email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MembersForm);
