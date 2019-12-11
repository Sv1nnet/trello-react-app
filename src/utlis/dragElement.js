/* eslint-disable no-param-reassign */
const setElementPosition = (initialPosition, e, element) => {
  const newListPosition = {
    x: e.clientX - initialPosition.x,
    y: e.clientY - initialPosition.y,
  };

  element.style.left = `${newListPosition.x}px`;
  element.style.top = `${newListPosition.y}px`;
  // element.style.transform = `translate(${newListPosition.x}px, ${newListPosition.y}px)`;
};

/**
 *
 * Allow to drag HTMLElement
 * @param element.current {HTMLElement} HTMLElement to drag;
 * @param event {Event} event object;
 * @param dragCallback {Object} mouse move event handler. Argument is passed in these callback is event object;
 */
const dragElement = (event, element, { startDragCallback, dragCallback, endDragCallback } = {}) => {
  const e = event.nativeEvent || event;
  const initialElementStyle = element.current.style;

  const initialPosition = {
    x: event.offsetX,
    y: event.offsetY,
  };

  const dragHandler = (mouseMoveEvent) => {
    setElementPosition(initialPosition, mouseMoveEvent, element.current);

    if (dragCallback) dragCallback(mouseMoveEvent);
  };

  // Remove all handlers on mouseUp
  const mouseUpHandler = (mouseMoveEvent) => {
    // return;
    window.removeEventListener('mousemove', dragHandler);
    window.removeEventListener('mouseup', mouseUpHandler);

    element.current.classList.remove('dragging');
    element.current.style = initialElementStyle;

    document.body.style.cursor = '';

    if (endDragCallback) endDragCallback(mouseMoveEvent);
  };

  element.current.classList.add('dragging');
  element.current.style.position = 'fixed';
  element.current.style.zIndex = '1001';
  element.current.style.pointerEvents = 'none';

  document.body.style.cursor = 'pointer';

  setElementPosition(initialPosition, e, element.current);

  // document.body.appendChild(element.current);

  window.addEventListener('mousemove', dragHandler);
  window.addEventListener('mouseup', mouseUpHandler);

  if (startDragCallback) startDragCallback(event);
};

export default dragElement;
