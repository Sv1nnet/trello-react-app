import hasParent from './hasParent';

/**
 * Switch elements position in DOM and invokes swtichPosition argument
 * @param {Event} e - event object;
 * @param {Object} source - object that contains: a) current - HTMLElement; b) _id - id of element
 * @param {Array} refs - array of refs
 * @param {Function} switchPosition - function that switches elements position and receives source and target objects
 */
const switchElements = (e, source, refs, switchPosition) => {
  // Find target in columnRefs and switch it with source element
  refs.some((element) => {
    if (e.target === element.current || hasParent(element.current, e.target)) {
      switchPosition(source, element);
      return true;
    }
    return false;
  });
};

export default switchElements;
