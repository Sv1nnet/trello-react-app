import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import '../../styles/cardItem.sass';
import boardActions from '../../actions/boardActions';

const CardFace = (props) => {
  const {
    cardTitle,
    cardId,
    board,
    token,
    cardPosition,
    refs = {},
  } = props;

  const {
    tempCardRefs,
    setCardRefs,
    cardRefs,
    cardContainerRef,
    editingTargetRef,
    dragTargetRef,
    cardDragAreaRef,
  } = refs;

  console.log('dragTargetRef', dragTargetRef)

  // useEffect(() => {
  // const newCardRefs = [...cardRefs];

  // newCardRefs.push({
  //   ...cardDragArea,
  //   _id: cardId,
  // });
  // setCardRefs(newCardRefs);
  // }, []);

  const deleteCard = (e) => {
    if (e.nativeEvent.shiftKey) {
      props.deleteCard(token.token, board._id, cardId)
        .then(res => console.log(res));
    }
  };

  return (
    <div ref={editingTargetRef} className="h-100">
      <div tabIndex="0" role="button" onKeyPress={deleteCard} onClick={deleteCard} ref={cardContainerRef} className="card-item d-flex px-2 flex-wrap align-items-center drag-source">
        <div className="title">
          <span>{console.log('card rendered', cardId, cardTitle)}</span>
          <span>{cardTitle}</span>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  deleteCard: (token, boardId, cardId) => dispatch(boardActions.deleteCard(token, boardId, cardId)),
})

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(
  CardFace,
  (prevProps, nextProp) => {
    return true;
  },
));
