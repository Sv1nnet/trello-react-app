/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import '../../styles/cardItem.sass';
import boardActions from '../../actions/boardActions';
import { ColumnListContext } from '../context/ColumnListContext';

const Card = (props) => {
  const {
    cardTitle,
    dragHandleProps,
    isDragging,
    cardId,
    board,
    token,
    refs,
    handleMouseDown,
    elementContainerRef,
  } = props;
  // dragHandleProps.ref.current = el;
  const { editingTargetRef } = refs;

  const deleteCard = (e) => {
    if (e.nativeEvent.shiftKey) {
      props.deleteCard(token.token, board._id, cardId)
        .then(() => {

        });
    }
  };

  return (
    <div tabIndex="0" role="button" onKeyPress={deleteCard} onClick={deleteCard} {...dragHandleProps} className="card-item d-flex px-2 flex-wrap align-items-center drag-source">
      <div onMouseDown={handleMouseDown} ref={editingTargetRef} className="h-100 w-100">
        <div className="title w-100">
          <span>{cardTitle}</span>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  deleteCard: (token, boardId, cardId) => dispatch(boardActions.deleteCard(token, boardId, cardId)),
});

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(Card));
