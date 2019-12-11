/**
 *
 * @param targets {Array} array ob objects with props:
 * 1) target - object we add event handler on;
 * 2) events - array of objects with props:
 * a) type - event type;
 * b) handler - event handler;
 */
const addEvents = (targets) => {
  targets.forEach((eventTarget) => {
    const { target } = eventTarget;
    eventTarget.events.forEach(event => target.addEventListener(event.type, event.handler));
  });
};

export default addEvents;
