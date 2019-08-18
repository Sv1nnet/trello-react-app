/**
 *
 * Find out whether HTML element has specified HTML parent
 * @param parent {HTMLElement} HTML parent element or node
 * @param child {HTMLElement} HTML chid element or node
 */

function hasParent(parent, child) {
  if (child.parentElement !== document.body) {
    if (child.parentElement !== parent) {
      return hasParent(parent, child.parentElement);
    }
    return true;
  }

  return false;
}

export default hasParent;
