import React, { useEffect, useRef } from 'react';
import '../../styles/cardItem.sass';

const CardFace = (props) => {
  const {
    cardTitle,
    cardId,
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

  return (
    <div ref={editingTargetRef} className="h-100">
      <div ref={cardContainerRef} className="card-item d-flex px-2 flex-wrap align-items-center drag-source">
        <div className="title">
          <span>{console.log('card rendered', cardId, cardTitle)}</span>
          <span>{cardTitle}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CardFace, (prevProps, nextProp) => {
  return prevProps.cardTitle === nextProp.cardTitle;
});
