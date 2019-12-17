import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from './DragDropContext';


const propTypes = {
  children: PropTypes.func.isRequired,
};


const Droppable = ({ droppableId, children }) => {
  const {
    dragState,
    dragStart,
    dragUpdate,
    dragEnd,
  } = useContext(DragDropContext);
  const droppableRef = useRef();

  const provider = {
    droppableProps: {
      // onMouseEnter,
      'data-droppable-id': droppableId,
    },
    innerRef: droppableRef,
  };

  // const scrollBoard = scrollElements([
  //   {
  //     elementToScroll: boardListContainerRef,
  //     scrollIntervals: {
  //       scrollHorizontalInterval: null,
  //       scrollVerticaltalInterval: null,
  //     },
  //     distanceToStartScrollingX: 150,
  //     scrollStepX: 15,
  //     scrollX: true,
  //   },
  // ]);

  // const onDragStart = (data) => {
  //   const removeMouseHanlers = () => {
  //     window.removeEventListener('mousemove', scrollBoard);
  //     window.removeEventListener('mouseup', scrollBoard);
  //   };

  //   if (data.type === 'task') {
  //     window.addEventListener('mousemove', scrollBoard);
  //     window.addEventListener('mouseup', removeMouseHanlers);
  //   }
  // };

  return children(provider);
};


Droppable.propTypes = propTypes;


export default Droppable;
