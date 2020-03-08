/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
// React/Redux components
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Custom components
import Messages from '../../utils/Messages';

// Custom hooks
import useStatus from '../../../utlis/hooks/useStatus';

// mapState and actions
import { mapStateToProps } from '../../../utlis/reduxMapFunction';
import actions from '../../../actions/boardActions';


const propTypes = {
  closePopup: PropTypes.func.isRequired,
  isPrivate: PropTypes.bool.isRequired,
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


const ReadonlyAccessBoardForm = ({ closePopup, isPrivate, user, board, updateBoard }) => {
  const [isBoardPrivate, setIsBoardPrivate] = useState(isPrivate);
  const {
    status,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  } = useStatus();

  const onChange = (e) => {
    setIsBoardPrivate(e.target.value === 'private');
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (isBoardPrivate === isPrivate) {
      closePopup(e);
      return;
    }

    const data = { isPrivate: isBoardPrivate };

    setStatusLoading();

    updateBoard(user.token.token, board._id, data)
      .then((res) => {
        handleSuccess(res);
        closePopup(e);
      })
      .catch(handleError);
  };

  return (
    <>
      <form action="" onSubmit={onSubmit} className="w-100">
        <span className="popup-title text-dark">Set board Private/Public</span>

        <div className="access-dropdown-inputs-container">
          <div className="access-input-container">
            <input onChange={onChange} className="access-input" type="radio" name="access" value="private" id="private" hidden defaultChecked={isBoardPrivate} />
            <label className="access-label text-center" htmlFor="private">Private</label>
            <span>Only board members can see this board.</span>
          </div>

          <div className="access-input-container">
            <input onChange={onChange} className="access-input" type="radio" name="access" value="public" id="public" hidden defaultChecked={!isBoardPrivate} />
            <label className="access-label text-center" htmlFor="public">Public</label>
            <span>All people can see this board.</span>
          </div>
        </div>

        <button type="submit" className="btn btn-success btn-block board-control-popup-btn" disabled={status.loading}>Apply</button>
      </form>
      {status.err.message && <Messages.ErrorMessage message={status.err.message} closeMessage={resetStatus} btn />}
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  updateBoard: (token, id, data) => dispatch(actions.updateBoard(token, id, data)),
});


ReadonlyAccessBoardForm.propTypes = propTypes;


export default connect(mapStateToProps.mapBoardAndUser, mapDispatchToProps)(ReadonlyAccessBoardForm);
