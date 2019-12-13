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


const Draggable = (props) => {
  const {
    containerId,
    draggableId,
    index,
    direction,
    type,
    children,
  } = props;

  const {
    draggableHTMLElements,
    dragState,
    dragStart,
    dragUpdate,
    dragEnd,
  } = useContext(DragDropContext);

  // console.log(dragState);

  const draggableElementRef = useRef();
  const draggableAnchorRef = useRef();

  const mouseState = {
    onMouseDownPosition: {
      x: null,
      y: null,
    },
  };
  const initialElementPosition = {
    x: null,
    y: null,
  };

  const onMouseMove = (e) => {
    if (!dragState.dragging && isMouseMoved(e, mouseState.onMouseDownPosition, 5)) {
      window.removeEventListener('mousemove', onMouseMove);

      // Here we need to keep order in this code cuz container of dragging elements scroll element once element is started dragging
      // So first of all we create a placeholder
      const placeholder = createPlaceholder(draggableElementRef.current);

      // Then start to drag the element
      dragElement(e, draggableElementRef, initialElementPosition);
      // Then insert placeholder
      draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current);
      console.log('placeholder bounries', placeholder.getBoundingClientRect())

      dragStart({ draggableContainerId: containerId, draggableId, type });
    }
  };

  const onMouseEnter = (e) => {
    // dragEvents.onUpdate(e);
    if (dragState.dragging && dragState.type === type) {
      const placeholder = document.querySelector('[data-type="placeholder"]');
      // debugger;
      if (placeholder) {
        console.log('previousElementSibling', draggableElementRef.current.previousElementSibling)
        if (placeholder.offsetTop > draggableElementRef.current.offsetTop) {
          draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current);
        } else if (placeholder.offsetTop < draggableElementRef.current.offsetTop) {
          draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current.nextElementSibling);
          placeholder.dataset.draggableIndex = index - 1;
        }
        // if (draggableElementRef.current.previousElementSibling === placeholder) {
        //   draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current);
        // } else if (draggableElementRef.current.nextElementSibling === placeholder) {
        //   draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current.previousElementSibling)
        // }
      }
      dragUpdate({ targetContainerId: containerId, targetId: draggableId, type });
    }
  };

  const onMouseUp = (e) => {
    const placeholder = document.querySelector('[data-type="placeholder"]');
    // const phOffsetY = placeholder.getBoundingClientRect().y;
    // const phOffsetX = placeholder.getBoundingClientRect().x;
    if (placeholder) placeholder.remove();

    // draggableElementRef.current.style.position = 'fixed';
    // draggableElementRef.current.style.left = phOffsetX;
    // draggableElementRef.current.style.top = phOffsetY;

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
    console.log({ containerId, draggableId, index, type })
    dragEnd({ containerId, draggableId, index, type });
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    const event = e.nativeEvent || e;

    if (event.button === 0) {
      mouseState.onMouseDownPosition.y = event.clientY;
      mouseState.onMouseDownPosition.x = event.clientX;

      initialElementPosition.y = event.offsetY;
      initialElementPosition.x = event.offsetX;

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
    isThisElementDragging: dragState.dragging && dragState.draggableId === draggableId,
  };

  return children(provider, snapshot);
};


Draggable.propTypes = propTypes;


export default React.memo(Draggable);
