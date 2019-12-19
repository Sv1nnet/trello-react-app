import React, { useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from './DragDropContext';
import scrollElements from '../../../utlis/scrollElements';


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

  const scrollDroppable = scrollElements([
    {
      elementToScroll: droppableRef,
      scrollIntervals: {
        scrollHorizontalInterval: null,
        scrollVerticaltalInterval: null,
      },
      distanceToStartScrollingX: 150,
      scrollStepX: 15,
      scrollX: true,
    },
  ]);

  const onMouseUp = (e) => {
    window.removeEventListener('mousemove', scrollDroppable);
  };

  const onMouseLeave = (e) => {
    window.removeEventListener('mousemove', scrollDroppable);
  };

  const onMouseEnter = (e) => {
    // const removeMouseHanlers = () => {
    //   window.removeEventListener('mousemove', scrollDroppable);
    //   window.removeEventListener('mouseup', scrollDroppable);
    // };

    window.addEventListener('mousemove', scrollDroppable);
    // window.addEventListener('mouseleave', onMouseLeave);

    // window.addEventListener('mouseup', removeMouseHanlers);
    // window.addEventListener('mouseleave', removeMouseHanlers);
  };

  useEffect(() => () => {
    console.log('droppable cleaned');
    window.removeEventListener('mousemove', scrollDroppable);
    window.removeEventListener('mouseleave', onMouseLeave);
  });

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

  return children(provider, dragState);
};


Droppable.propTypes = propTypes;


export default Droppable;
