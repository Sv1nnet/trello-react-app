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
  refs.forEach((element) => {
    if (e.target === element.current || hasParent(element.current, e.target)) {
      // Get siblings os target and source element elements
      // const targetSibling = {
      //   next: element.current.nextElementSibling,
      //   previous: element.current.previousElementSibling,
      // };
      // const sourceSibling = {
      //   next: source.current.nextElementSibling,
      //   previous: source.current.previousElementSibling,
      // };

      // // Place source where target is placed
      // if (targetSibling.next) {
      //   targetSibling.next.before(source.current);
      // } else {
      //   targetSibling.previous.after(source.current);
      // }

      // // Place target where source was placed
      // if (sourceSibling.next) {
      //   sourceSibling.next.before(element.current);
      // } else {
      //   sourceSibling.previous.after(element.current);
      // }

      switchPosition(source, element);
    }
  });
};

export default switchElements;
