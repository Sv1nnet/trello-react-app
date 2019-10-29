import React, { useRef, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import DraggableContainer from '../utils/DraggableContainer';
import Card from './Card';
import isMouseMoved from '../../utlis/isMouseMoved';
import '../../styles/cardItem.sass';
import { ColumnListContext } from '../context/ColumnListContext';


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
    // cardRefs,
    cardsContainerRef,
  } = cardRefsAPI;

  const { cardsContextAPI } = useContext(ColumnListContext);

  const { cardRefs, renderedCardsState } = cardsContextAPI;

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
    if (!e.nativeEvent.shiftKey && e.target !== editCardBtnRef.current) {
      e.preventDefault();

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
    }
  };

  const mouseEnter = (e) => {
    console.log('mouseenter')
    console.log('e.target', e.target)

    const cardTarget = cardRefs.find(card => card.current === e.target);
    const source = { _id: cardId, columnId };
    const target = { _id: cardTarget._id, columnId: cardTarget.column };

    console.log('cardRefs', cardRefs)
    console.log('source', source)
    console.log('target', target)
    switchCards(source, target);
  };
  // console.log('cardRefsAPI', cardRefsAPI)
  const scrollOptions = [
    {
      elementToScroll: columnsContainer,
      distanceToStartScrollingX: 150,
      scrollStepX: 7,
      scrollX: true,
    },
    {
      // elementToScroll: columnsContainer,
      elementToScroll: cardsContainerRef,
      distanceToStartScrollingY: 35,
      scrollStepY: 7,
      scrollY: true,
    },
  ];

  // console.log('card rendered', cardTitle)

  useEffect(() => {
    // effect
    return () => {
      console.log(' ---------------------- clean up --------------------')
    };
  });

  // console.log('scrollOptions', scrollOptions)
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


// export default CardContainer;
export default React.memo(CardContainer, (prevProps, nextProps) => {
  console.log('memo works -----------------------')
  return true;
  const result = prevProps.columnId === nextProps.columnId
    && prevProps.cardTitle === nextProps.cardTitle
    && prevProps.cardData.cardPosition === nextProps.cardData.cardPosition
    && prevProps.cardData.cardTitle === nextProps.cardData.cardTitle
    && prevProps.cardRefsAPI.cardRefs === nextProps.cardRefsAPI.cardRefs;
    // && nextProps.cardRefsAPI.cardRefs.length === 0;

  // console.log('prevProps.columnId === nextProps.columnId', prevProps.columnId === nextProps.columnId);
  // console.log('prevProps.cardTitle === nextProps.cardTitle', prevProps.cardTitle === nextProps.cardTitle);
  // console.log('prevProps.cardData.cardPosition === nextProps.cardData.cardPosition', prevProps.cardData.cardPosition === nextProps.cardData.cardPosition);
  // console.log('prevProps.cardData.cardTitle === nextProps.cardData.cardTitle', prevProps.cardData.cardTitle === nextProps.cardData.cardTitle);
  // console.log('prevProps.cardRefsAPI.cardRefs.length === nextProps.cardRefsAPI.cardRefs.length', prevProps.cardRefsAPI.cardRefs.length === nextProps.cardRefsAPI.cardRefs.length);
  console.log('result', result);

  // return true;
  return result;
});
