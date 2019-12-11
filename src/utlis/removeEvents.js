/**
 *
 * @param targets {Array} array ob objects with props:
 * 1) target - object we remove event handler from;
 * 2) events - array of objects with props:
 * a) type - event type;
 * b) handler - event handler;
 */
const removeEvents = (targets) => {
  targets.forEach((eventTarget) => {
    const { target } = eventTarget;
    eventTarget.events.forEach(event => target.removeEventListener(event.type, event.handler));
  });
};

export default removeEvents;
