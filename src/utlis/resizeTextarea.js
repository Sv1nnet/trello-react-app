/* eslint-disable no-param-reassign */

/**
 * Change textarea height corresponding its content
 * @param {HTMLElement} textarea textarea HTML element or ref object with "current" prop
 */

const resizeTextarea = (textarea) => {
  const element = textarea.current ? textarea.current : textarea;
  // Set textarea height 1px to recalculate its content height
  if (element) {
    element.style.height = '1px';

    const { scrollHeight } = element;
    const newHeight = `${scrollHeight + 2}px`;

    element.style.height = newHeight;
  }
};

export default resizeTextarea;
