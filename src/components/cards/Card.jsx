/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import '../../styles/cardItem.sass';
import boardActions from '../../actions/boardActions';

const Card = (props) => {
  const {
    cardTitle,
    cardId,
    columnId,
    board,
    token,
    refs,
    cardRefsAPI,
    handleMouseDown,
    elementContainerRef,
  } = props;

  const {
    cardContainerRef,
    editingTargetRef,
    dragTargetRef,
  } = refs;

  const { tempCardRefs, setCardRefs, cardRefs } = cardRefsAPI;



  useEffect(() => {
    tempCardRefs.push({
      ...dragTargetRef,
      _id: cardId,
      column: columnId,
      title: cardTitle,
    });
    setCardRefs([...cardRefs, ...tempCardRefs]);
  }, []);

  const deleteCard = (e) => {
    if (e.nativeEvent.shiftKey) {
      props.deleteCard(token.token, board._id, cardId)
        .then(() => {
          const newRefs = cardRefs.filter(cardRef => cardRef._id !== cardId);
          setCardRefs([...newRefs]);
        });
    }
  };

  return (
    <div tabIndex="0" role="button" onKeyPress={deleteCard} onClick={deleteCard} ref={elementContainerRef} className="card-item d-flex px-2 flex-wrap align-items-center drag-source">
      <div onMouseDown={handleMouseDown} ref={editingTargetRef} className="h-100">
        <div className="title">
          <span>{console.log('card rendered', cardRefs, cardTitle)}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(
  Card,
  (prevProps, nextProps) => (
    prevProps.cardPosition === nextProps.cardPosition
    && prevProps.cardTitle === nextProps.cardTitle
    && prevProps.cardRefsAPI.cardRefs.length === nextProps.cardRefsAPI.cardRefs.length
  ),
));
