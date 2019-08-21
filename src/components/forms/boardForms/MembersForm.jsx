/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInput from '../../utils/TextInput';
import Loader from '../../utils/Loader';
import actions from '../../../actions/boardActions';
import Messages from '../../utils/Messages';
import UserList from '../../lists/UserListItem';


const propTypes = {
  boardId: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
  })).isRequired,
  token: PropTypes.shape({
    access: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired,
  findUsers: PropTypes.func.isRequired,
  addMember: PropTypes.func.isRequired,
  removeMember: PropTypes.func.isRequired,
  updateMembers: PropTypes.func.isRequired,
};


class MembersForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      getUsersInterval: undefined,
      members: props.members,
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
    };
  }

  componentDidMount() {
    const { updateMembers } = this.props;

    // Get board members once component was mounted (members form was opened)
    updateMembers();
  }

  /*
   * Every change event we should clearTimeout.
   * After value was updated we find users with findUsers function
   */
  handleChange = (e) => {
    const { target } = e;
    const { timeout } = this.state;

    clearTimeout(timeout);
    this.setState(state => ({
      ...state,
      inputValue: target.value,
    }),
    () => { this.findUsers(); });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.findUsers();
  }

  // Add member to this board
  handleAddMember = (member) => {
    const { addMember, token, boardId } = this.props;

    return addMember(token.token, boardId, member)
      .catch((err) => {
        this.setState(state => ({
          ...state,
          status: {
            loading: false,
            success: {
              ...state.status.success,
            },
            err: {
              message: err.message,
              statusCode: err.status,
            },
          },
        }));
        return Promise.reject(err);
      });
  }

  // Remove member from this board
  handleRemoveMember = (member) => {
    const { removeMember, token, boardId } = this.props;

    return removeMember(token.token, boardId, member)
      .catch((err) => {
        this.setState(state => ({
          ...state,
          status: {
            loading: false,
            success: {
              ...state.status.success,
            },
            err: {
              message: err.message,
              statusCode: err.status,
            },
          },
        }));
        return Promise.reject(err);
      });
  }

  /*
   * Clear input value and add members to the state from props.
   * We need set members this way to prevent deleted member from removing
   * from this current list. We need this to be able to return member to the board
   * if he was removed accidentally
   */
  clearInput = () => {
    const { updateMembers, members } = this.props;

    this.setState(state => ({
      ...state,
      inputValue: '',
      members,
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

    updateMembers();
  }

  /*
   * If value is epmty or '.' error occures on a server. So firstly we check what inputValue
   * equals to. Then send request and if it was successful put found users into state.
   * Searching users gets started in 500ms after onChange in input occured.
   */
  findUsers = () => {
    const { inputValue } = this.state;
    const { findUsers, token, updateMembers, members } = this.props;

    if (inputValue && inputValue !== '.') {
      const timeout = setTimeout(() => {
        findUsers(token.token, inputValue)
          .then((data) => {
            // Set results
            this.setState(state => ({
              ...state,
              status: {
                ...state.status,
                loading: false,
                success: {
                  message: data.data.message,
                  data: data.data.users,
                  statusCode: 200,
                },
              },
            }));
          })
          .catch((err) => {
            // Set error
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

        // Show loader
        this.setState(state => ({
          ...state,
          timeout,
          status: {
            ...state.status,
            loading: true,
          },
        }));
      }, 500);

      // Set timeout
      this.setState(state => ({
        ...state,
        timeout,
      }));
    } else {
      // If user deletes all input then clear success status in order to only show members
      this.setState(state => ({
        ...state,
        members,
        status: {
          ...state.status,
          success: {
            message: '',
            data: undefined,
            statusCode: undefined,
          },
        },
      }));

      updateMembers();
    }
  }

  // Close error message
  closeMessage = () => {
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
    const { boardId, owner } = this.props;
    const { members, inputValue, status } = this.state;
    // IF we have success request object then show user list from it.
    // Otherwise show user list from prop - list of board members
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
            ? users.map((user) => {
              // Users that came from props doesn't have boards prop.
              // If users came from search request we need check if they are board members
              // by searching current board id in their boards
              const isMember = user.boards ? !!user.boards.find(board => board._id === boardId) : true;

              return (
                <UserList
                  addMember={this.handleAddMember}
                  removeMember={this.handleRemoveMember}
                  key={user._id}
                  userId={user._id}
                  email={user.email}
                  nickname={user.nickname}
                  isMember={isMember}
                  isOwner={owner === user._id}
                />
              );
            })
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

const mapStateToProps = state => ({
  token: state.user.token,
});

const mapDispatchToProps = dispatch => ({
  findUsers: (token, email) => dispatch(actions.findUsers(token, email)),
  addMember: (token, boardId, member) => dispatch(actions.addMember(token, boardId, member)),
  removeMember: (token, boardId, member) => dispatch(actions.removeMember(token, boardId, member)),
});


MembersForm.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(MembersForm);
