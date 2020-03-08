/* eslint-disable no-param-reassign */
const setElementPosition = (initialPosition, e, element) => {
  const newElementPosition = {
    x: e.clientX - initialPosition.x,
    y: e.clientY - initialPosition.y,
  };

  element.style.left = `${newElementPosition.x}px`;
  element.style.top = `${newElementPosition.y}px`;
};

/**
 *
 * Allow to drag HTMLElement
 * @param {HTMLElement} element HTML Element or React ref object to drag.
 * @param {Event} event event object.
 * @param {Object} initialPosition object with initial element coords.
 * @param {number} initialPosition.x x element position.
 * @param {number} initialPosition.y y element position.
 * @param {Object} dragCallback mouse move event handler. Argument is passed in these callback is event object.
 * @param {function} dragCallback.startDragCallback mouse start moving event handler.
 * @param {function} dragCallback.dragCallback mouse move event handler.
 * @param {function} dragCallback.endDragCallback mouse end moving event handler.
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
