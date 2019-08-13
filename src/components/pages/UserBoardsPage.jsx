/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions/boardActions';
import BoardListItem from '../boards/BoardListItem';
import CreateBoard from '../boards/CreateBoard';

class UserBoardsPage extends Component {
  state = {
    createBoardActive: false,
    status: {
      loading: true,
      success: {
        message: '',
        statusCode: undefined,
      },
      err: {
        message: '',
        statusCode: undefined,
      },
    },
  }

  componentDidMount() {
    const { props } = this;
    const { token } = props;

    props.loadAllBoards(token)
      .then((res) => {
        if (res) {
          if (res.status === 200) {
            const { message } = res.data;

            this.setState(state => ({
              ...state,
              status: {
                loading: false,
                success: {
                  message,
                  statusCode: 200,
                },
              },
            }));
          }
        } else {
          this.setState(state => ({
            ...state,
            status: {
              loading: false,
              err: {
                message: 'No connection with server',
                statusCode: 500,
              },
            },
          }));
        }
      })
      .catch((err) => {
        this.setState(state => ({
          ...state,
          status: {
            loading: false,
            err: {
              message: err,
              statusCode: 200,
            },
          },
        }));
      });
  }

  // console.log('state.status.loading', state.status.loading);
  openCreateBoard = (e) => {
    e.preventDefault();

    this.setState(state => ({
      ...state,
      createBoardActive: true,
    }));
  };

  closeCreateBoard = () => {
    this.setState(state => ({
      ...state,
      createBoardActive: false,
    }));
  };

  render() {
    const { state } = this;
    const { boards } = this.props;

    return (
      <div className="container-fluid">
        <h3 className="text-center text-white mt-3">Boards</h3>

        <div style={{ maxHeight: `${window.innerHeight - 164}px` }} className="row overflow-auto">
          {boards.map(board => (
            <div key={board._id} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-2">
              <BoardListItem id={board._id} title={board.title} />
            </div>
          ))}
        </div>

        <div className="col-12 px-0 text-center py-3">
          <a className="text-white" onClick={this.openCreateBoard} href="/">Create a new board</a>
        </div>

        {state.createBoardActive && <CreateBoard close={this.closeCreateBoard} />}

      </div>
    );
  }
};

const mapStateToProps = state => ({
  boards: state.user.userData.boards,
  token: state.user.token.token,
});

const mapDispatchToProps = dispatch => ({
  loadAllBoards: token => dispatch(actions.loadAllBoards(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserBoardsPage);
