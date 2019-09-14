import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import DraggableContainer from '../utils/DraggableContainer';
import CardFace from 'CardFace';
import isMouseMoved from '../../utlis/isMouseMoved';
import '../../styles/cardItem.sass';


const CardContainer = (props) => {
  const {
    cardId
    tempCardRefs,
    setCardRefs,
    cardRefs,
    columnRef,
    handleError,
    switchCards,
  } = props;

  const cardDragTarget = useRef(null);
  const editingTarget = useRef(null);
  const editCardBtn = useRef(null);
  const cardContainer = useRef(null);
  const cardDragArea = useRef(null);

  // We need pass it to DraggableContainer to scroll it when cursore comes to edge of this element
  const boardColumnsContainer = document.querySelector('.board-lists-container');

  const mouseDown = (e, { handleMouseUp, handleMouseMove }) => {
    if (e.target !== editCardBtn.current) {
      e.preventDefault();

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
    }
  };

  const mouseEnter = (e) => {
    switchColumns(e, {
      ...cardDragTarget,
      _id: cardId,
    });
  };

  const scrollOptions = [
    {
      elementToScroll: boardColumnsContainer,
      distanceToStartScrollingX: 150,
      scrollStepX: 7,
      scrollX: true,
    },
    {
      elementToScroll: columnRef.current,
      distanceToStartScrollingY: 20,
      scrollStepY: 7,
      scrollY: true,
    },
  ];

  return (
    <DraggableContainer
      extraClasses="column-drag-area"
      dragTarget={columnDragTarget}
      scrollOptions={scrollOptions}
      mouseEvents={{ mouseUp, mouseDown, mouseEnter }}
      elementRefs={columnRefs}
    >
      <CardFace
        refs={{
          editingTarget,
          tempCardRefs,
          setCardRefs,
          cardRefs,
          cardDragArea,
        }}
        cards={cards}
        listTitle={listTitle}
        columnId={columnId}
        handleError={handleError}
        switchColumns={switchColumns}
      />
    </DraggableContainer>
  );
};


CardContainer.propTypes = {

};


export default CardContainer;
