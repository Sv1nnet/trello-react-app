/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions/boardActions';
import BoardListItem from '../boards/BoardListItem';
import CreateBoard from '../boards/CreateBoard';

const UserBoardsPage = (props) => {
  const { boards, token } = props;
  const [state, setState] = useState({
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
  });

  const openCreateBoard = (e) => {
    e.preventDefault();

    setState({
      ...state,
      createBoardActive: true,
    });
  };

  const closeCreateBoard = () => {
    setState({
      ...state,
      createBoardActive: false,
    });
  };

  if (state.status.loading) {
    props.loadAllBoards(token)
      .then((res) => {
        if (res) {
          if (res.status === 200) {
            const { message } = res.data;

            setState({
              ...state,
              status: {
                loading: false,
                success: {
                  message,
                  statusCode: 200,
                },
              },
            });
          }
        }
      })
      .catch((err) => {
        setState({
          ...state,
          status: {
            loading: false,
            err: {
              message: err,
              statusCode: 200,
            },
          },
        });
      });
  }

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
        <a className="text-white" onClick={openCreateBoard} href="/">Create a new board</a>
      </div>

      {state.createBoardActive && <CreateBoard close={closeCreateBoard} />}

    </div>
  );
};

const mapStateToProps = state => ({
  boards: state.user.userData.boards,
  token: state.user.token.token,
});

const mapDispatchToProps = dispatch => ({
  loadAllBoards: token => dispatch(actions.loadAllBoards(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserBoardsPage);
