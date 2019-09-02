/* eslint-disable no-param-reassign */
const setElementPosition = (initialPosition, e, element) => {
  const newListPosition = {
    x: e.clientX - initialPosition.x,
    y: e.clientY - initialPosition.y,
  };

  element.style.left = `${newListPosition.x}px`;
  element.style.top = `${newListPosition.y}px`;
};

/**
 *
 * Allow to drag HTMLElement
 * @param element {HTMLElement} HTMLElement to drag;
 * @param event {Event} event object;
 * @param dragCallback {Object} mouse move event handler. Argument is passed in these callback is event object;
 */
const dragElement = (event, element, { startDragCallback, dragCallback, endDragCallback } = {}) => {
  const e = event.nativeEvent || event;
  const initialPosition = {
    x: event.offsetX,
    y: event.offsetY,
  };

  const dragHandler = (mouseMoveEvent) => {
    setElementPosition(initialPosition, mouseMoveEvent, element);

    if (dragCallback) dragCallback(event);
  };

  // Remove all handlers
  const mouseUpHandler = () => {
    window.removeEventListener('mousemove', dragHandler);
    window.removeEventListener('mouseup', mouseUpHandler);

    element.classList.remove('dragging');
    element.style = '';

    if (endDragCallback) endDragCallback(event);
  };

  element.classList.add('dragging');
  setElementPosition(initialPosition, e, element);

  document.body.appendChild(element);

  window.addEventListener('mousemove', dragHandler);
  window.addEventListener('mouseup', mouseUpHandler);

  if (startDragCallback) startDragCallback(event);
};

export default dragElement;
