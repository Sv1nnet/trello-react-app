import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import DraggableContainer from '../utils/DraggableContainer';
import CardFace from './CardFace';
import isMouseMoved from '../../utlis/isMouseMoved';
import '../../styles/cardItem.sass';


const CardContainer = (props) => {
  const {
    setCardRefs,
    handleError,
    switchCards,
    cards,
    cardData,
    columnId,
    refs,
  } = props;

  const { cardId, cardPostiion, cardTitle } = cardData;
  const { cardRefs, cardsContainerRef, tempCardRefs } = refs;

  const cardDragTargetRef = useRef(null);
  const editingTargetRef = useRef(null);
  const editCardBtnRef = useRef(null);
  const cardContainerRef = useRef(null);
  const cardDragAreaRef = useRef(null);
  const cardRef = useRef(null);

  // We need pass it to DraggableContainer to scroll it when cursore comes to edge of this element
  const columnsContainer = document.querySelector('.board-lists-container');

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
      distanceToStartScrollingY: 20,
      scrollStepY: 7,
      scrollY: true,
    },
  ];

  const mouseUp = () => { };
  return (
    <DraggableContainer
      extraClasses="card-drag-area"
      dragTargetRef={cardDragTargetRef}
      scrollOptions={scrollOptions}
      mouseEvents={{ mouseUp, mouseDown, mouseEnter }}
      elementRefs={cardRefs}
    >
      <CardFace
        refs={{
          editingTargetRef,
          tempCardRefs,
          setCardRefs,
          cardRefs,
          cardDragAreaRef,
        }}
        cards={cards}
        cardTitle={cardTitle}
        cardId={cardId}
        columnId={columnId}
        position={cardPostiion}
        handleError={handleError}
        switchColumns={switchCards}
      />
    </DraggableContainer>
  );
};


CardContainer.propTypes = {

};


export default React.memo(CardContainer, (prevProps, nextProps) => {
  return true;
});
