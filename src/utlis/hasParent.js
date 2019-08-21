/**
 *
 * Find out whether HTML element has specified HTML parent
 * @param parent {HTMLElement} HTML parent element or node
 * @param child {HTMLElement} HTML chid element or node
 */

function hasParent(parent, child) {
  /*
   * We need check if child exists because close message method invokes before this function
   * and child is deletes from DOM doesn't exist, so it throws error.
   * And to prevent throwing error or unexpected closing popup
   * it should return true.
   */
  if (!child) return true;

  // Now preform main logic of this function
  if (child.parentElement !== document.body) {
    if (child.parentElement !== parent) {
      return hasParent(parent, child.parentElement);
    }
    return true;
  }
  return false;
}

export default hasParent;
