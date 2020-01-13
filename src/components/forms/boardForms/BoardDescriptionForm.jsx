import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import boardActions from '../../../actions/boardActions';
import TextInput from '../../utils/TextInput';


const propTypes = {
  token: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    description: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
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
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => {
        handleError(err);
      });
    console.log('submitted');
  };

  const onBlur = (e) => {
    onSubmit(e);
  };

  const onKeyPress = (e) => {
    if (e.nativeEvent.shiftKey && (e.nativeEvent.charCode === 13 || e.nativeEvent.key === 'Enter')) {
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
        maxLength="250"
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

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  updateBoard: (token, boardId, data) => dispatch(boardActions.updateBoard(token, boardId, data)),
});


BoardDescriptionForm.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(BoardDescriptionForm);
