// React/Redux components
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Custom components
import TextInput from '../../utils/TextInput';

// mapState and actions
import { mapStateToProps } from '../../../utlis/reduxMapFunction';
import boardActions from '../../../actions/boardActions';

// Utils
import isEnterPressed from '../../../utlis/isEnterPressed';


const propTypes = {
  token: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    description: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  updateBoard: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
};


const BoardDescriptionForm = ({ token, board, updateBoard, handleError }) => {
  const [boardDescription, setBoardDescription] = useState(board.description);

  const onChange = (e) => {
    const { target } = e;

    setBoardDescription(target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // TODO: Colmplete server response
    const data = { description: boardDescription };
    updateBoard(token.token, board._id, data)
      .catch(handleError);
  };

  const onBlur = (e) => {
    if (e.target.value !== board.description) onSubmit(e);
  };

  const onKeyPress = (e) => {
    if (e.nativeEvent.shiftKey && isEnterPressed(e)) {
      e.preventDefault();
      e.target.blur();
    }
  };

  return (
    <form action="" onSubmit={onSubmit}>
      <TextInput
        hideSearchBtn
        hideCrossBtn
        inputType="textarea"
        placeholder="Add a description to this board"
        maxLength="180"
        varticalPadding={2}
        classList="board-menu-text-input px-1"
        name="board-description"
        inputValue={boardDescription}
        onChange={onChange}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
      />
    </form>
  );
};

const mapDispatchToProps = dispatch => ({
  updateBoard: (token, boardId, data) => dispatch(boardActions.updateBoard(token, boardId, data)),
});


BoardDescriptionForm.propTypes = propTypes;


export default connect(mapStateToProps.mapRequestData, mapDispatchToProps)(BoardDescriptionForm);
