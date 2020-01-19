/* eslint-disable no-param-reassign */

/**
 * Change textarea height corresponding its content
 * @param {HTMLElement} textarea textarea HTML element or ref object with "current" prop
 * @param {number} verticalPadding top + bottom padding
 */

const resizeTextarea = (textarea, verticalPadding = 0) => {
  const element = textarea.current ? textarea.current : textarea;
  // Set textarea height 1px to recalculate its content height
  if (element) {
    element.style.height = '1px';

    const { scrollHeight } = element;
    const newHeight = `${scrollHeight + verticalPadding}px`;

    element.style.height = newHeight;
  }
};

export default resizeTextarea;
