/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../styles/createBoard.sass';
import CreateBoardForm from '../forms/CreateBoardForm';
import actions from '../../actions/boardActions';
import Messages from '../utils/Messages';

const CreateBoard = (props) => {
  const [state, setState] = useState({
    err: {
      status: undefined,
      message: undefined,
    },
    description: '',
    title: '',
    access: 'private',
    newBoardId: null,
    boardCreated: false,
  });
  const { close } = props;

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { token } = props;
    props.createBoard({ token, title: state.title, access: state.access, description: state.description })
      .then((res) => {
        // If there is response from server
        if (res) {
          // If board was successfully created
          if (res.status === 200) {
            setState({
              err: {
                status: undefined,
                message: undefined,
              },
              access: 'private',
              title: '',
              boardCreated: true,
              newBoardId: res.data.id,
            });
            close();
          } else {
            // If error occured while creating board
            setState({
              ...state,
              err: {
                status: res.status,
                message: res.data.err,
              },
            });
          }
        } else {
          // If there is no respnse from server
          setState({
            ...state,
            err: {
              status: 500,
              message: 'No connection with server',
            },
          });
        }
      });
  };

  const closeMessage = () => {
    setState({ ...state, err: { status: undefined, message: undefined } });
  };

  if (state.boardCreated) return <Redirect to={`/board/${state.newBoardId}`} />;

  return (
    <>
      <div className="fixed-top create-board-container mt-5 text-center">
        <div className="container-fluid pt-3 pb-3 bg-white position-relative">
          <div className="row no-gutters justify-content-center">

            <div className="create-board-close-btn-container">
              <div className="icon-container active">
                <FontAwesomeIcon onClick={close} className="close-button" icon={faTimes} />
              </div>
            </div>

            <div className="col-12 col-sm-12 text-center">
              <h5>Create a new board</h5>
            </div>

            <div className="col-12 col-sm-12">
              {state.err.message && <Messages.ErrorMessage message={state.err.message} closeMessage={closeMessage} />}
              <CreateBoardForm handleSubmit={handleSubmit} handleChange={handleChange} title={state.title} description={state.description} />
            </div>

          </div>
        </div>
      </div>
      <div onClick={close} className="modal-bg" />
    </>
  );
};

const mapStateToProps = state => ({
  token: state.user.token.token,
});

const mapDispatchToProps = dispatch => ({
  createBoard: (token, data) => dispatch(actions.createBoard(token, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateBoard);
