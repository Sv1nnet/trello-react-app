import React, { useRef, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { Draggable } from 'react-beautiful-dnd';
import Draggable from '../utils/dragdrop/Draggable';
import DraggableContainer from '../utils/DraggableContainer';
import Card from './Card';
import isMouseMoved from '../../utlis/isMouseMoved';
import '../../styles/cardItem.sass';
import { ColumnListContext } from '../context/ColumnListContext';


const CardContainer = (props) => {
  const {
    index,
    handleError,
    switchCards,
    cards,
    cardData,
    columnId,
    cardRefsAPI,
    innerRef,
  } = props;

  const { cardId, cardPostion, cardTitle } = cardData;

  const { cardsContextAPI } = useContext(ColumnListContext);

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
    console.log('mose down')
    if (!e.nativeEvent.shiftKey && e.target !== editCardBtnRef.current) {
      e.preventDefault();

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
    }
  };

  const mouseEnter = (e) => {

  };

  useEffect(() => {
    // effect
    return () => {
      console.log(' ---------------------- clean up --------------------')
    };
  });

  useEffect(() => {
    console.log('card was mounted');
  }, []);

  // console.log('scrollOptions', scrollOptions)
  // action="UPDATE_CARDS"
  return (
    <Draggable draggableId={cardId} index={index} direction="vertical" type="card">
      {(dragProvided, snapshot) => (
        <div {...dragProvided.draggableProps} ref={dragProvided.innerRef} className="card-drag-area drag-target">
          <Card
            refs={{
              editingTargetRef,
            }}
            dragHandleProps={dragProvided.dragHandleProps}
            isDragging={snapshot.isThisElementDragging}
            cardRefsAPI={cardRefsAPI}
            cards={cards}
            cardTitle={cardTitle}
            cardId={cardId}
            columnId={columnId}
            position={cardPostion}
            handleError={handleError}
            switchCards={switchCards}
          />
        </div>
      )}
    </Draggable>
  );
};
{/* <div className="card-drag-area drag-target">
      <Card
        refs={{
          editingTargetRef,
        }}
        cardRefsAPI={cardRefsAPI}
        cards={cards}
        cardTitle={cardTitle}
        cardId={cardId}
        columnId={columnId}
        position={cardPostion}
        handleError={handleError}
        switchCards={switchCards}
      />
    </div> */}


CardContainer.propTypes = {

};


// export default CardContainer;
export default React.memo(CardContainer, (prevProps, nextProps) => {
  const result = prevProps.columnId === nextProps.columnId
    && prevProps.cardTitle === nextProps.cardTitle
    && prevProps.cardData.cardPosition === nextProps.cardData.cardPosition
    && prevProps.cardData.cardTitle === nextProps.cardData.cardTitle;
  return result;
});
