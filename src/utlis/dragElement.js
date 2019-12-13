/* eslint-disable no-param-reassign */
const setElementPosition = (initialPosition, e, element) => {
  // debugger;
  const newElementPosition = {
    x: e.clientX - initialPosition.x,
    y: e.clientY - initialPosition.y,
  };

  element.style.left = `${newElementPosition.x}px`;
  element.style.top = `${newElementPosition.y}px`;
  // element.style.transform = `translate(${newElementPosition.x}px, ${newElementPosition.y}px)`;
};

/**
 *
 * Allow to drag HTMLElement
 * @param element.current {HTMLElement} HTMLElement to drag;
 * @param event {Event} event object;
 * @param dragCallback {Object} mouse move event handler. Argument is passed in these callback is event object;
 */
const dragElement = (event, element, initialPosition, { startDragCallback, dragCallback, endDragCallback } = {}) => {
  const e = event.nativeEvent || event;
  const elementToDrag = element.current || element;
  const initialElementStyle = elementToDrag.style;

  const dragHandler = (mouseMoveEvent) => {
    setElementPosition(initialPosition, mouseMoveEvent, elementToDrag);

    if (dragCallback) dragCallback(mouseMoveEvent);
  };

  // Remove all handlers on mouseUp
  const mouseUpHandler = (mouseMoveEvent) => {
    window.removeEventListener('mousemove', dragHandler);
    window.removeEventListener('mouseup', mouseUpHandler);

    elementToDrag.classList.remove('dragging');
    elementToDrag.style = initialElementStyle;

    document.body.style.cursor = '';

    if (endDragCallback) endDragCallback(mouseMoveEvent);
  };

  elementToDrag.classList.add('dragging');
  elementToDrag.style.position = 'fixed';
  elementToDrag.style.zIndex = '1001';
  elementToDrag.style.pointerEvents = 'none';

  document.body.style.cursor = 'pointer';

  setElementPosition(initialPosition, e, elementToDrag);

  window.addEventListener('mousemove', dragHandler);
  window.addEventListener('mouseup', mouseUpHandler);

  if (startDragCallback) startDragCallback(event);
};

export default dragElement;
