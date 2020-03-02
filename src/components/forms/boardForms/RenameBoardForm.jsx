/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
// React/Redux components
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Custom components
import TextInput from '../../utils/TextInput';
import Messages from '../../utils/Messages';

// mapState and actions
import { mapStateToProps } from '../../../utlis/reduxMapFunction';
import actions from '../../../actions/boardActions';


const propTypes = {
  closePopup: PropTypes.func.isRequired,
  boardTitle: PropTypes.string.isRequired,
  user: PropTypes.shape({
    token: PropTypes.shape({
      access: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  updateBoard: PropTypes.func.isRequired,
};


const RenameBoardForm = ({ closePopup, boardTitle, user, board, updateBoard }) => {
  const [state, setState] = useState({
    boardTitle,
    err: {
      message: '',
      statusCode: undefined,
    },
  });

  const handleChange = (e) => {
    setState({ ...state, boardTitle: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (state.boardTitle === boardTitle) return closePopup(e);

    if (state.boardTitle.length < 1) {
      return setState({ ...state, err: { message: 'Input the board title', statusCode: 400 } });
    }

    const data = {
      title: state.boardTitle,
    };

    updateBoard(user.token.token, board._id, data)
      .then((res) => {
        closePopup(e);
      })
      .catch((err) => {
        setState({ ...state, err: { message: err.message, statusCode: err.status } });
      });
  };

  const clearInput = () => {
    setState({ ...state, boardTitle: '' });
  };

  const closeMessage = () => {
    // TODO Handle no title
    if (state.err.message === 'Input the board title') {}
    setState({ ...state, err: { message: '', statusCode: undefined } });
  };

  return (
    <>
      <form action="" onSubmit={handleSubmit} className="w-100">
        <span className="popup-title text-dark">Rename board</span>
        <div className="input-container">
          <label htmlFor="titlename">Title</label>
          <TextInput
            onCrossBtnClick={clearInput}
            onChange={handleChange}
            inputValue={state.boardTitle}
            classList="rename-board-input"
            name="titlename"
            id="titlename"
            placeholder="Enter new board name"
            hideSearchBtn
            focusAfterCleared
            selectOnMounted
          />
        </div>
        <button type="submit" className="btn btn-success btn-block board-control-popup-btn">Rename</button>
      </form>
      {state.err.message && <Messages.ErrorMessage message={state.err.message} closeMessage={closeMessage} btn />}
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  updateBoard: (token, id, data) => dispatch(actions.updateBoard(token, id, data)),
});


RenameBoardForm.propTypes = propTypes;


export default connect(mapStateToProps.mapBoardAndUser, mapDispatchToProps)(RenameBoardForm);
