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
    editingTarget,
    cardDragArea,
  } = refs;

  // useEffect(() => {
  // const newCardRefs = [...cardRefs];

  // newCardRefs.push({
  //   ...cardDragArea,
  //   _id: cardId,
  // });
  // setCardRefs(newCardRefs);
  // }, []);

  return (
    <div ref={cardDragArea} className="card-drag-area drag-target">
      <div ref={editingTarget} className="h-100">
        <div ref={cardContainerRef} className="card-item d-flex px-2 flex-wrap align-items-center drag-source">
          <div className="title">
            <span>{console.log('card rendered', cardId)}</span>
            <span>{cardTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CardFace);
