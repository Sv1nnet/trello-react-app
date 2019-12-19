/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const createPlaceholder = ({ element, dataset, shouldDeleteCurrent = false }) => {
  if (shouldDeleteCurrent) {
    const placeholders = document.querySelectorAll('[data-type="placeholder"]');
    if (placeholders.length > 0) Array.prototype.forEach.call(placeholders, (placeholder => placeholder.remove()));
  }

  const computedStyle = getComputedStyle(element);
  const elementSize = {
    minWidth: `${element.offsetWidth}px`,
    height: `${element.offsetHeight}px`,
    marginLeft: computedStyle.marginLeft,
    marginRight: computedStyle.marginRight,
    marginTop: computedStyle.marginTop,
    marginBottom: computedStyle.marginBottom,
  };

  const placeholder = document.createElement('div');
  for (const data in dataset) {
    placeholder.dataset[data] = dataset[data];
  }

  for (const prop in elementSize) {
    placeholder.style[prop] = elementSize[prop];
  }

  placeholder.style.backgroundColor = 'rgba(0, 0, 0, .2)';

  return placeholder;
};
window.createPlaceholder = createPlaceholder;
export default createPlaceholder;
