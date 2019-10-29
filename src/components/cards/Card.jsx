/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import '../../styles/cardItem.sass';
import boardActions from '../../actions/boardActions';
import { ColumnListContext } from '../context/ColumnListContext';

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

  const { tempCardRefs } = cardRefsAPI;
  const { cardsContextAPI } = useContext(ColumnListContext);
  const { cardRefs, setCardRefs} = cardsContextAPI;

  useEffect(() => {
    tempCardRefs.push({
      ...dragTargetRef,
      _id: cardId,
      column: columnId,
      title: cardTitle,
    });

    // console.log('new refs', [...cardRefs, ...tempCardRefs])
    console.log('setting card refs in useEffect in Card', cardTitle)
    setCardRefs([...cardRefs, ...tempCardRefs]);
  }, []);

  // useEffect(() => {
  //   tempCardRefs.push({
  //     ...dragTargetRef,
  //     _id: cardId,
  //     column: columnId,
  //     title: cardTitle,
  //   });

  //   setCardRefs([...cardRefs, ...tempCardRefs]);
  // }, [cardRefs]);

  const deleteCard = (e) => {
    if (e.nativeEvent.shiftKey) {
      props.deleteCard(token.token, board._id, cardId)
        .then(() => {
          const newRefs = cardRefs.filter(cardRef => cardRef._id !== cardId);
          console.log('setting card refs in deleteCard resolve')
          setCardRefs([...newRefs]);
        });
    }
  };

  // console.log('card rerendered', cardTitle)

  return (
    <div tabIndex="0" role="button" onKeyPress={deleteCard} onClick={deleteCard} ref={elementContainerRef} className="card-item d-flex px-2 flex-wrap align-items-center drag-source">
      <div onMouseDown={handleMouseDown} ref={editingTargetRef} className="h-100">
        <div className="title">
          {/* <span>{console.log('card rendered', cardRefs, cardTitle)}</span> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Card);
// export default connect(mapStateToProps, mapDispatchToProps)(React.memo(
//   Card,
//   // () => true,
//   () => false,
//   // (prevProps, nextProps) => (
//   //   prevProps.cardPosition === nextProps.cardPosition
//   //   && prevProps.cardTitle === nextProps.cardTitle
//   //   && prevProps.cardRefsAPI.cardRefs === nextProps.cardRefsAPI.cardRefs
//   //   // && prevProps.cardRefsAPI.cardRefs.length === nextProps.cardRefsAPI.cardRefs.length
//   // ),
// ));
