/**
 * Detect if mouse was moved after mousedown event occured
 * @param e {Event} ReactEvent objecr or nativeEvent object
 * @param initailPosition {Object} Object that contains x and y coordinates where onMouseDown occured
 * @param difference {Number} distance that mouse have to be moved to be considered as moved
 */
const isMouseMoved = (e, initialPosition, difference = 0) => {
  const event = e.nativeEvent || e;

  const currentX = event.x;
  const currentY = event.y;

  const initialX = initialPosition.x;
  const initialY = initialPosition.y;

  const isXDifferent = Math.abs(initialX - currentX) > difference;
  const isYDifferent = Math.abs(initialY - currentY) > difference;

  return isXDifferent || isYDifferent;
};

export default isMouseMoved;
