/*!
 * Check if an element is out of the viewport
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Element}  elem The element to check
 * @return {Object}     A set of booleans for each side of the element
 */
const isOutOfViewport = function isOutOfViewport(elem) {
  if (!elem || !(elem instanceof Node)) throw new Error('Passed element in arguments isn\'t an instance of HTMLElement');

  // Get element's bounding
  const bounding = elem.getBoundingClientRect();

  // Check if it's out of the viewport on each side
  const out = {};

  out.top = bounding.top < 0;
  out.left = bounding.left < 0;
  out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
  out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
  out.any = out.top || out.left || out.bottom || out.right;
  out.all = out.top && out.left && out.bottom && out.right;

  return out;
};

export default isOutOfViewport;
