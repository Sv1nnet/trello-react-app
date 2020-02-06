import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../../../styles/addLabelForm.sass';
import LabelCheckbox from './LabelCheckbox';
import boardActions from '../../../../actions/boardActions';


const AddLabelForm = ({ token, board, cardId, attachedLabels, attachLabel, removeLabel }) => {
  const onLableChange = (e) => {
    const { target } = e;
    const data = {
      colorName: target.name,
      id: target.id,
    };

    const changeResultPromise = target.checked ? attachLabel(token.token, board._id, cardId, target.id, data) : removeLabel(token.token, board._id, cardId, target.id, data);
    changeResultPromise
      .then((res) => console.log('label action success', res))
      .catch((err) => console.log('label error', err));
  };

  return (
    <div className="add-label-popup__container">
      <span className="popup-title">Lables</span>

      <form action="" onSubmit={() => {}}>
        <span className="add-label-popup-title">SELECT LABEL</span>

        {board.labels.map(label => <LabelCheckbox key={label._id} id={label._id} onChange={onLableChange} colorName={label.colorName} color={label.color} title={label.title} checked={!!attachedLabels[label._id]} />)}
      </form>
    </div>
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

AddLabelForm.propTypes = {
  
};


export default connect(mapStateToProps, mapDispatchToProps)(AddLabelForm);
