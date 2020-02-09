import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../../../styles/addLabelForm.sass';
import LabelCheckbox from './LabelCheckbox';
import boardActions from '../../../../actions/boardActions';
import useStatus from '../../../../utlis/hooks/useStatus';
import Messages from '../../../utils/Messages';


const propTypes = {
  token: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      colorName: PropTypes.string.isRequired,
      title: PropTypes.string,
    })),
  }).isRequired,
  cardId: PropTypes.string.isRequired,
  attachedLabels: PropTypes.shape({}),
  attachLabel: PropTypes.func.isRequired,
  removeLabel: PropTypes.func.isRequired,
};

const defaultProps = {
  attachedLabels: {},
};


const AddLabelForm = (props) => {
  const {
    token,
    board,
    cardId,
    attachedLabels,
    attachLabel,
    removeLabel,
  } = props;

  const {
    status,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  } = useStatus();

  const onLableChange = (e) => {
    const { target } = e;
    const data = {
      colorName: target.name,
      id: target.id,
    };

    const changeResultPromise = target.checked ? attachLabel(token.token, board._id, cardId, target.id, data) : removeLabel(token.token, board._id, cardId, target.id, data);
    setStatusLoading();

    changeResultPromise
      .then(handleSuccess)
      .catch(handleError);
  };

  return (
    <>
      <div className="add-label-popup__container">
        <span className="popup-title">Lables</span>

        <form action="" onSubmit={(e) => { e.preventDefault(); }}>
          <span className="add-label-popup-title">SELECT LABEL</span>

          {board.labels.map(label => <LabelCheckbox key={label._id} id={label._id} onChange={onLableChange} colorName={label.colorName} color={label.color} title={label.title} checked={!!attachedLabels[label._id]} />)}
        </form>
      </div>

      {status.err.message && ReactDOM.createPortal(
        <Messages.ErrorMessage message={status.err.message} closeMessage={resetStatus} btn />,
        document.querySelector('.App'),
      )}
    </>
  );
};

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  attachLabel: (token, boardId, cardId, data) => dispatch(boardActions.attachLabel(token, boardId, cardId, data)),
  removeLabel: (token, boardId, cardId, data) => dispatch(boardActions.removeLabel(token, boardId, cardId, data)),
});

AddLabelForm.propTypes = propTypes;
AddLabelForm.defaultProps = defaultProps;


export default connect(mapStateToProps, mapDispatchToProps)(AddLabelForm);
