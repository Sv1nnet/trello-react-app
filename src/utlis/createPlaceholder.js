/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const createPlaceholder = (elementTemplate, dataset) => {
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
