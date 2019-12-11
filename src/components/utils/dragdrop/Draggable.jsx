import React, { useState, useContext, useRef, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from './DragDropContext';
import dragElement from '../../../utlis/dragElement';
import isMouseMoved from '../../../utlis/isMouseMoved';
import removeEvents from '../../../utlis/removeEvents';
import addEvents from '../../../utlis/addEvents';
import createPlaceholder from '../../../utlis/createPlaceholder';


const propTypes = {
  children: PropTypes.func.isRequired,
};


const Draggable = ({ draggableId, index, direction, type, children }) => {
  const {
    draggableHTMLElements,
    dragState,
    dragStart,
    dragUpdate,
    dragEnd,
  } = useContext(DragDropContext);

  console.log(dragState);

  const draggableElementRef = useRef();
  const draggableAnchorRef = useRef();

  const mouseState = {
    onMouseDownPosition: {
      x: null,
      y: null,
    },
  };

  const onMouseMove = (e) => {
    if (!dragState.dragging && isMouseMoved(e, mouseState.onMouseDownPosition, 5)) {
      window.removeEventListener('mousemove', onMouseMove);

      // Here we need to keep order in this code cuz container of dragging elements scroll element once element is started dragging
      // So first of all we create a placeholder
      const placeholder = createPlaceholder(draggableElementRef.current);
      placeholder.dataset.type = 'placeholder';

      // Then start to drag the element
      dragElement(e, draggableElementRef);
      // Then insert placeholder
      draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current);

      dragStart(draggableId);
    }
  };

  const onMouseEnter = (e) => {
    // dragEvents.onUpdate(e);
    if (dragState.dragging) console.log('mouseEnter')
  };

  const onMouseUp = (e) => {
    removeEvents([
      {
        target: window,
        events: [
          {
            type: 'mousemove',
            handler: onMouseMove,
          },
          {
            type: 'mouseup',
            handler: onMouseUp,
          },
        ],
      },
    ]);
    // window.removeEventListener('mousemove', onMouseMove);
    // window.removeEventListener('mouseup', onMouseUp);
    dragEnd(draggableId);
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    const event = e.nativeEvent || e;

    if (event.button === 0) {
      mouseState.onMouseDownPosition.y = event.y;
      mouseState.onMouseDownPosition.x = event.x;

      addEvents([
        {
          target: window,
          events: [
            {
              type: 'mousemove',
              handler: onMouseMove,
            },
            {
              type: 'mouseup',
              handler: onMouseUp,
            },
          ],
        },
      ]);

      // window.addEventListener('mousemove', onMouseMove);
      // window.addEventListener('mouseup', onMouseUp);
    }
  };

  useEffect(() => {
    const { current } = draggableAnchorRef;
    // console.log('effect', dragState)
    current.addEventListener('mousedown', onMouseDown);

    return () => {
      current.removeEventListener('mousedown', onMouseDown);
      console.log('cleanup')
    };
  }, [draggableHTMLElements]);

  const provider = {
    dragHandleProps: {
      // onMouseDown,
      // onMouseMove,
      // onMouseUp,
      ref: draggableAnchorRef,
    },
    draggableProps: {
      onMouseEnter,
      key: draggableId,
      'data-draggable-id': draggableId,
      'data-draggable-index': index,
      'data-draggable-direction': direction || 'vertical',
      'data-draggable-type': type || '',
    },
    innerRef: draggableElementRef,
  };

  const snapshot = {
    ...dragState,
    isThisElementDragging: dragState.dragging && dragState.dragElementId === draggableId,
  };

  return children(provider, snapshot);
};


Draggable.propTypes = propTypes;


export default React.memo(Draggable);
