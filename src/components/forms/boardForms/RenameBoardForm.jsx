/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
// React/Redux components
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Custom components
import TextInput from '../../utils/TextInput';
import Messages from '../../utils/Messages';

// Custom hooks
import useStatus from '../../../utlis/hooks/useStatus';

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
  const [title, setTitle] = useState(boardTitle);
  const {
    status,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  } = useStatus();

  const onChange = (e) => {
    setTitle(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (title === boardTitle) {
      closePopup(e);
      return;
    }

    if (title.length < 1) {
      handleError({ status: 400, message: 'Input the board title' });
      return;
    }

    const data = {
      title,
    };

    setStatusLoading();

    updateBoard(user.token.token, board._id, data)
      .then((res) => {
        handleSuccess(res);
        closePopup(e);
      })
      .catch(handleError);
  };

  const clearInput = () => {
    setTitle('');
  };

  return (
    <>
      <form action="" onSubmit={onSubmit} className="w-100">
        <span className="popup-title text-dark">Rename board</span>
        <div className="input-container">
          <label htmlFor="titlename">Title</label>
          <TextInput
            onCrossBtnClick={clearInput}
            onChange={onChange}
            inputValue={title}
            classList="rename-board-input"
            name="titlename"
            id="titlename"
            placeholder="Enter new board name"
            hideSearchBtn
            focusAfterCleared
            selectOnMounted
          />
        </div>
        <button type="submit" className="btn btn-success btn-block board-control-popup-btn" disabled={status.loading}>Rename</button>
      </form>
      {status.err.message && <Messages.ErrorMessage message={status.err.message} closeMessage={resetStatus} btn />}
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  updateBoard: (token, id, data) => dispatch(actions.updateBoard(token, id, data)),
});


RenameBoardForm.propTypes = propTypes;


export default connect(mapStateToProps.mapBoardAndUser, mapDispatchToProps)(RenameBoardForm);
