/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../actions/boardActions';
import Messages from '../../utils/Messages';


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
  const [state, setState] = useState({
    isPrivate,
    err: {
      message: '',
      statusCode: undefined,
    },
  });

  const handleChange = (e) => {
    setState({ ...state, isPrivate: e.target.value === 'private' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (state.isPrivate === isPrivate) return closePopup(e);

    const data = { isPrivate: state.isPrivate };
    const { token } = user.token;
    const { _id } = board;

    updateBoard(token, _id, data)
      .then((res) => {
        closePopup(e);
      })
      .catch((err) => {
        setState({ ...state, err: { message: err.message, statusCode: err.status } });
      });
  };

  const closeMessage = () => {
    setState({ ...state, err: { message: '', statusCode: undefined } });
  };

  return (
    <>
      <form action="" onSubmit={handleSubmit} className="w-100">
        <span className="popup-title text-dark">Set board Private/Public</span>

        <div className="access-dropdown-inputs-container">
          <div className="access-input-container">
            <input onChange={handleChange} className="access-input" type="radio" name="access" value="private" id="private" hidden defaultChecked={state.isPrivate} />
            <label className="access-label text-center" htmlFor="private">Private</label>
            <span>Only board members can see this board.</span>
          </div>

          <div className="access-input-container">
            <input onChange={handleChange} className="access-input" type="radio" name="access" value="public" id="public" hidden defaultChecked={!state.isPrivate} />
            <label className="access-label text-center" htmlFor="public">Public</label>
            <span>All people can see this board.</span>
          </div>
        </div>

        <button type="submit" className="btn btn-success btn-block board-control-popup-btn">Apply</button>
      </form>
      {state.err.message && <Messages.ErrorMessage message={state.err.message} closeMessage={closeMessage} btn />}
    </>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  updateBoard: (token, id, data) => dispatch(actions.updateBoard(token, id, data)),
});


ReadonlyAccessBoardForm.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(ReadonlyAccessBoardForm);
