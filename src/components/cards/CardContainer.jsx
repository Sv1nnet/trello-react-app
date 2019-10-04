import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import DraggableContainer from '../utils/DraggableContainer';
import Card from './Card';
import isMouseMoved from '../../utlis/isMouseMoved';
import '../../styles/cardItem.sass';


const CardContainer = (props) => {
  const {
    handleError,
    switchCards,
    cards,
    cardData,
    columnId,
    cardRefsAPI,
  } = props;

  const { cardId, cardPostiion, cardTitle } = cardData;

  const {
    cardRefs,
    cardsContainerRef,
  } = cardRefsAPI;

  const cardDragTargetRef = useRef(null);
  const editingTargetRef = useRef(null);
  const editCardBtnRef = useRef(null);

  // We need pass it to DraggableContainer to scroll it when cursore comes to edge of this element
  const columnsContainer = document.querySelector('.board-lists-container');

  const mouseUp = (e, mouseState) => {
    // If user moves mouse more then 5 pixels across X or Y than drag column.
    // Otherwise focus titleInputRef in order to change title.
    // if (!isMouseMoved(e, mouseState.onMouseDownPosition, 5) && document.activeElement !== titleInputRef.current) {
    //   e.preventDefault();
    //   editingTargetRef.current.style.display = 'none';

    //   titleInputRef.current.focus();
    //   titleInputRef.current.select();
    // }
  };

  const mouseDown = (e, { handleMouseUp, handleMouseMove }) => {
    if (e.target !== editCardBtnRef.current) {
      e.preventDefault();

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
    }
  };

  const mouseEnter = (e) => {
    switchCards(e, {
      ...cardDragTargetRef,
      column: columnId,
      _id: cardId,
    });
  };

  const scrollOptions = [
    {
      elementToScroll: columnsContainer,
      distanceToStartScrollingX: 150,
      scrollStepX: 7,
      scrollX: true,
    },
    {
      elementToScroll: cardsContainerRef.current,
      distanceToStartScrollingY: 35,
      scrollStepY: 7,
      scrollY: true,
    },
  ];

  // action="UPDATE_CARDS"
  return (
    <DraggableContainer
      extraClasses="card-drag-area"
      dragTargetRef={cardDragTargetRef}
      scrollOptions={scrollOptions}
      mouseEvents={{ mouseUp, mouseDown, mouseEnter }}
      elementRefs={cardRefs}
    >
      <Card
        refs={{
          editingTargetRef,
        }}
        cardRefsAPI={cardRefsAPI}
        cards={cards}
        cardTitle={cardTitle}
        cardId={cardId}
        columnId={columnId}
        position={cardPostiion}
        handleError={handleError}
        switchCards={switchCards}
      />
    </DraggableContainer>
  );
};


CardContainer.propTypes = {

};


export default CardContainer;
// export default React.memo(CardContainer, (prevProps, nextProps) => (
//   prevProps.columnId === nextProps.columnId
//   && prevProps.cardTitle === nextProps.cardTitle
//   && prevProps.cardData.cardPosition === nextProps.cardData.cardPosition
//   && prevProps.cardData.cardTitle === nextProps.cardData.cardTitle
//   && prevProps.cardRefsAPI.cardRefs.length === nextProps.cardRefsAPI.cardRefs.length
// ));
