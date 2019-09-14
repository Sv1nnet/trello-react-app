import React, { useRef, useContext } from 'react';
import isMouseMoved from '../../utlis/isMouseMoved';
import dragElement from '../../utlis/dragElement';
import scrollElements from '../../utlis/scrollElements';
import { ColumnListContext } from '../context/ColumnListContext';

const DraggableContainer = (props) => {
  const {
    children,
    elementRefs,
    extraClasses,
    elementToScroll,
    dragTarget,
    mouseEvents,
  } = props;

  const { mouseUp, mouseEnter, mouseDown } = mouseEvents;

  const { updatePositions } = useContext(ColumnListContext);
  const refElementContainer = useRef(null);

  const mouseState = {
    mouseDown: false,
    onMouseDownPosition: {
      x: undefined,
      y: undefined,
    },
  };

  const dragState = {
    dragging: false,
  };

  const scrollIntervals = {
    scrollHorizontalInterval: undefined,
    scrollVerticalInterval: undefined,
  };

  // Add mouseEnter handler on all columns except HTMLElement we drag
  const addElementsMouseEnterHandler = () => {
    const HTMLElementList = elementRefs.filter(el => el.current !== dragTarget.current);

    if (HTMLElementList.length !== 0) {
      HTMLElementList.forEach(HTMLElement => HTMLElement.current.addEventListener('mouseenter', mouseEnter));
    }
  };

  // Remove mouseEnter handler on all columns except HTMLElement we drag(cause we don't have that handler on it)
  const removeElementsMouseEnterHandler = () => {
    const HTMLElementList = elementRefs.filter(el => el.current !== dragTarget.current);

    if (HTMLElementList.length !== 0) {
      HTMLElementList.forEach(HTMLElement => HTMLElement.current.removeEventListener('mouseenter', mouseEnter));
    }

    clearInterval(scrollIntervals.scrollHorizontalInterval);
    scrollIntervals.scrollHorizontalInterval = undefined;

    clearInterval(scrollIntervals.scrollVerticalInterval);
    scrollIntervals.scrollVerticalInterval = undefined;
  };

  const endDragHandler = (e) => {
    removeElementsMouseEnterHandler(e);
    updatePositions();
  };

  // If mouse moved then set column state as dragging, add drag style to dragged column and
  // add drag event handlers
  const handleMouseMove = (e) => {
    if (!dragState.dragging && isMouseMoved(e, mouseState.onMouseDownPosition, 5)) {
      const scrollOptions = props.scrollOptions.map(options => ({
        elementToScroll: options.elementToScroll,
        distanceToStartScrollingX: options.distanceToStartScrollingX,
        distanceToStartScrollingY: options.distanceToStartScrollingY,
        scrollIntervals,
        scrollStepX: options.scrollStepX,
        scrollX: options.scrollX,
        scrollStepY: options.scrollStepY,
        scrollY: options.scrollY,
      }));

      dragState.dragging = true;
      dragTarget.current.classList.add('dragging');

      dragElement(
        e,
        refElementContainer.current,
        {
          startDragCallback: addElementsMouseEnterHandler,
          dragCallback: scrollElements(scrollOptions),
          endDragCallback: endDragHandler,
        },
      );
    }
  };

  // Remove drag state, drag style and drag event handlers.
  // Also, if mouse wasn't moved then set focus on textarea in order to change column title
  const handleMouseUp = (e) => {
    if (dragState.dragging && mouseState.mouseDown) {
      dragState.dragging = false;
    }

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);

    dragTarget.current.classList.remove('dragging');

    dragTarget.current.appendChild(refElementContainer.current);

    if (mouseUp) mouseUp(e, mouseState);
  };

  // If pressed mouse button is left one then set mouse click position in mouse state.
  // If textarea is not focused then add mouseup and mousemove event handlers.
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;

    mouseState.mouseDown = true;
    mouseState.onMouseDownPosition.x = e.nativeEvent.x;
    mouseState.onMouseDownPosition.y = e.nativeEvent.y;

    if (mouseDown) mouseDown(e, { handleMouseUp, handleMouseMove });
  };

  const childrenWithProps = React.Children.map(children, child => React.cloneElement(child, {
    handleMouseDown,
    handleMouseUp,
    dragTarget,
    refElementContainer,
  }));

  return (
    <div ref={dragTarget} className={`${extraClasses || ''} drag-target`}>
      {childrenWithProps}
    </div>
  );
};

export default DraggableContainer;
