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
  const [readonly, setReadonly] = useState(isReadOnly);
  const {
    status,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  } = useStatus();

  const onChange = (e) => {
    setReadonly(e.target.value === 'readonly');
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (readonly === isReadOnly) return closePopup(e);

    const data = { isReadOnly: readonly };

    setStatusLoading();

    return updateBoard(user.token.token, board._id, data)
      .then((res) => {
        handleSuccess(res);
        closePopup(e);
      })
      .catch(handleError);
  };

  return (
    <>
      <form action="" onSubmit={onSubmit} className="w-100">
        <span className="popup-title text-dark">Set board Editable/Read-only</span>

        <div className="access-dropdown-inputs-container">
          <div className="access-input-container">
            <input onChange={onChange} className="access-input" type="radio" name="readonly" value="readonly" id="readonly" hidden defaultChecked={readonly} />
            <label className="access-label text-center" htmlFor="readonly">Readonly</label>
            <span>Board members can not edit this board.</span>
          </div>

          <div className="access-input-container">
            <input onChange={onChange} className="access-input" type="radio" name="readonly" value="editable" id="editable" hidden defaultChecked={!readonly} />
            <label className="access-label text-center" htmlFor="editable">Editable</label>
            <span>Board members can edit this board.</span>
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
