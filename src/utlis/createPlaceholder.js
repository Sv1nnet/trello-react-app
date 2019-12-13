/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const createPlaceholder = (elementTemplate) => {
  const computedStyle = getComputedStyle(elementTemplate);
  const elementSize = {
    minWidth: `${elementTemplate.offsetWidth}px`,
    height: `${elementTemplate.offsetHeight}px`,
    marginLeft: computedStyle.marginLeft,
    marginRight: computedStyle.marginRight,
    marginTop: computedStyle.marginTop,
    marginBottom: computedStyle.marginBottom,
  };

  const placeholder = document.createElement('div');
  placeholder.dataset.type = 'placeholder';
  placeholder.dataset.draggableIndex = elementTemplate.dataset.draggableIndex;

  for (const prop in elementSize) {
    placeholder.style[prop] = elementSize[prop];
  }

  placeholder.style.backgroundColor = 'rgba(0, 0, 0, .2)';

  return placeholder;
};
window.createPlaceholder = createPlaceholder;
export default createPlaceholder;
