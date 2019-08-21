/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../actions/boardActions';
import Messages from '../../utils/Messages';


const propTypes = {
  closePopup: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
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


const ReadonlyAccessBoardForm = ({ closePopup, isReadOnly, user, board, updateBoard }) => {
  const [state, setState] = useState({
    isReadOnly,
    err: {
      message: '',
      statusCode: undefined,
    },
  });

  const handleChange = (e) => {
    setState({ ...state, isReadOnly: e.target.value === 'readonly' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (state.isReadOnly === isReadOnly) return closePopup(e);

    const data = {
      isReadOnly: state.isReadOnly,
    };

    updateBoard(user.token.token, board._id, data)
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
        <span className="popup-title text-dark">Set board Editable/Read-only</span>

        <div className="access-dropdown-inputs-container">
          <div className="access-input-container">
            <input onChange={handleChange} className="access-input" type="radio" name="readonly" value="readonly" id="readonly" hidden defaultChecked={state.isReadOnly} />
            <label className="access-label text-center" htmlFor="readonly">Readonly</label>
            <span>Board members can not edit this board.</span>
          </div>

          <div className="access-input-container">
            <input onChange={handleChange} className="access-input" type="radio" name="readonly" value="editable" id="editable" hidden defaultChecked={!state.isReadOnly} />
            <label className="access-label text-center" htmlFor="editable">Editable</label>
            <span>Board members can edit this board.</span>
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
