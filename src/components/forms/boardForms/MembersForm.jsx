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
  userId: PropTypes.string.isRequired, // current user id
  boardId: PropTypes.string.isRequired, // current board id
  ownerId: PropTypes.string.isRequired, // board owener id
  members: PropTypes.arrayOf(PropTypes.shape({ // members that we get from redux-store
    _id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
  })).isRequired,
  token: PropTypes.shape({ // token object
    access: PropTypes.string.isRequired, // token access type
    token: PropTypes.string.isRequired, // token
  }).isRequired,
  findUsers: PropTypes.func.isRequired, // find users by email
  addMember: PropTypes.func.isRequired, // add user to board members
  removeMember: PropTypes.func.isRequired, // remove user from board members
  updateMembers: PropTypes.func.isRequired, // get board members from server and set them to redux-store
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
    updateMembers().then(() => {
      const { members } = this.props;

      this.setState(state => ({
        ...state,
        members,
      }));
    });
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
    const { removeMember, token, boardId, updateMembers } = this.props;

    return removeMember(token.token, boardId, member)
      .then(() => {
        updateMembers();
      })
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
   * from current list of members. We need this to be able to return member to the board
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

    updateMembers().then(() => {
      const { props } = this;
      const updatedMmbers = props.members;

      this.setState(state => ({
        ...state,
        inputValue: '',
        members: updatedMmbers,
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
    });
  }

  /*
   * If value is epmty or '.' error occures on a server. So firstly we check what inputValue
   * equals to. Then send request and if it was successful put found users into state.
   * Searching users gets started in 500ms after onChange in input occured.
   */
  findUsers = () => {
    const { inputValue } = this.state;
    const { findUsers, token } = this.props;

    if (inputValue && inputValue !== '.') {
      const timeout = setTimeout(() => {
        findUsers(token.token, inputValue)
          .then((data) => {
            // Set results
            this.handleResult(data);
          })
          .catch((err) => {
            // Set error
            this.handleError(err);
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
      this.clearInput();
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

  handleError = (err) => {
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
  }

  handleResult = (data) => {
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
  }

  render() {
    const { boardId, ownerId, userId } = this.props;
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
              // Users that came from props (board members) don't have boards prop.
              // If users came from search request we need check if they are board members
              // by searching current board id in their boards
              const isMember = user.boards ? !!user.boards.find(board => board._id === boardId) : true;
              const isOwner = ownerId === user._id;

              // We want to let user remove himself from board member and add back if he removed accidentally
              // So we need to find out if he is board member (isBoardMember), if current user in users array is the user logged in (isUserCurrentUser)
              // and if logged in user is the board owner (isUserOwner).
              const isBoardMember = !!members.find(member => member._id === user._id);
              const isUserCurrentUser = userId === user._id;
              const isUserOwner = userId === ownerId;

              // If logged in user is the board owner then user in list have to be enabled to click.
              // But if user in list is the board owner then he can't be removed from the board, so he have to be disebled to click.
              // Otherwise if current user in users array is not a logged in user or if he is not a board member and is logged in user then
              // we have to not let add or remove current user in array.
              let disabled = false;

              if (user.boards) {
                disabled = isUserOwner ? isOwner : (!isUserCurrentUser || (!isBoardMember && isUserCurrentUser));
              } else {
                disabled = (userId !== ownerId && userId !== user._id);
              }

              return (
                <UserList
                  addMember={this.handleAddMember}
                  removeMember={this.handleRemoveMember}
                  key={user._id}
                  userId={user._id}
                  email={user.email}
                  nickname={user.nickname}
                  isMember={isMember}
                  isOwner={isOwner}
                  disabled={disabled}
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
  userId: state.user.userData._id,
  token: state.user.token,
});

const mapDispatchToProps = dispatch => ({
  findUsers: (token, email) => dispatch(actions.findUsers(token, email)),
  addMember: (token, boardId, member) => dispatch(actions.addMember(token, boardId, member)),
  removeMember: (token, boardId, member) => dispatch(actions.removeMember(token, boardId, member)),
});


MembersForm.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(MembersForm);
