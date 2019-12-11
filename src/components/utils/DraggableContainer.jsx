import React, { useRef, useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import isMouseMoved from '../../utlis/isMouseMoved';
import scrollElements from '../../utlis/scrollElements';
import { ColumnListContext } from '../context/ColumnListContext';

const DraggableContainer = (props) => {
  const {
    children, // Elements to render inside DraggableContainer
    elementRefs, // Array of refs that mouse event hendlers will be added on
    extraClasses, // Extra classes will be added to a drag container
    dragTargetRef, // Ref that is a area where element have to be dragged to
    mouseEvents, // mouseUp, mouseEnter, mouseDown events passed from element container
    action, // card or column positions we should update
    elementStartedMoving,
    id,
  } = props;

  const { mouseUp, mouseEnter, mouseDown } = mouseEvents;

  const { columnContextAPI, cardsContextAPI } = useContext(ColumnListContext);

  const { updateCardPositions, cardRefs } = cardsContextAPI;
  const { updateColumnPositions, switchPositionState } = columnContextAPI;

  const [renderedChildren, setRenderedChildren] = useState();

  const elementContainerRef = useRef(null);

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

  // console.log('elementRefs', elementRefs)

  // Add mouseEnter handler on all columns except HTMLElement we drag
  const addElementsMouseEnterHandler = (e, HTMLElement) => {
    if (HTMLElement) HTMLElement.addEventListener('mouseenter', mouseEnter);
    // const HTMLElementList = elementRefs.filter(el => el.current !== dragTargetRef.current);

    // if (HTMLElementList.length !== 0) {
    //   HTMLElementList.forEach(HTMLElement => HTMLElement.current.addEventListener('mouseenter', mouseEnter));
    // }
  };

  // Remove mouseEnter handler on all columns except HTMLElement we drag(cause we don't have that handler on it)
  const removeElementsMouseEnterHandler = (e, HTMLElement) => {
    if (HTMLElement) HTMLElement.removeEventListener('mouseenter', mouseEnter);
    // const HTMLElementList = cardRefs.filter(el => el.current !== dragTargetRef.current);
    // const HTMLElementList = elementRefs.filter(el => el.current !== dragTargetRef.current);

    // if (HTMLElementList.length !== 0) {
    //   HTMLElementList.forEach(HTMLElement => HTMLElement.current.removeEventListener('mouseenter', mouseEnter));
    // }

    clearInterval(scrollIntervals.scrollHorizontalInterval);
    scrollIntervals.scrollHorizontalInterval = undefined;

    clearInterval(scrollIntervals.scrollVerticalInterval);
    scrollIntervals.scrollVerticalInterval = undefined;
  };

  const endDragHandler = (e) => {
    removeElementsMouseEnterHandler(e);
    switch (action) {
      case 'UPDATE_COLUMNS':
        updateColumnPositions();
        break;
      case 'UPDATE_CARDS':
        updateCardPositions();
        break;

      default:
        break;
    }
  };

  // If mouse moved then set element state as dragging, add drag style to dragged element and
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
      dragTargetRef.current.classList.add('dragging');

      // dragElement(
      //   e,
      //   elementContainerRef,
      //   {
      //     startDragCallback: addElementsMouseEnterHandler,
      //     dragCallback: scrollElements(scrollOptions),
      //     endDragCallback: endDragHandler,
      //   },
      // );

      elementStartedMoving(id);
    }
  };

  // Remove drag state, drag style and drag event handlers.
  const handleMouseUp = (e) => {
    // return;
    if (dragState.dragging && mouseState.mouseDown) {
      dragState.dragging = false;
    }

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);

    dragTargetRef.current.classList.remove('dragging');

    // dragTargetRef.current.appendChild(elementContainerRef.current);

    if (mouseUp) mouseUp(e, mouseState);
  };

  // If pressed mouse button is left one then set mouse click position in mouse state.
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;

    mouseState.mouseDown = true;
    mouseState.onMouseDownPosition.x = e.nativeEvent.x;
    mouseState.onMouseDownPosition.y = e.nativeEvent.y;

    if (mouseDown) mouseDown(e, { handleMouseUp, handleMouseMove });
  };

  const childrenWithProps = React.Children.map(children, child => React.cloneElement(child, {
    refs: {
      ...child.props.refs,
      dragTargetRef,
    },
    handleMouseDown,
    handleMouseUp,
    elementContainerRef,
    style: {
      position: 'absolute',
    },
    key: child.props.columnData ? child.props.columnData.columnId : '',
  }));

  useEffect(() => {
    setRenderedChildren(childrenWithProps);
  }, []);

  return (
    <div ref={dragTargetRef} className={`${extraClasses || ''} drag-target`}>
      {switchPositionState.id === id ? ReactDOM.createPortal(renderedChildren, document.body, childrenWithProps[0].props.columnData ? childrenWithProps[0].props.columnData.columnId : '') : renderedChildren}
    </div>
  );
};

export default DraggableContainer;
