/**
 *  Find out if "Enter" has been pressed
 * @param {event} e react event object
 * @return bool
 */
const isEnterPressed = (e) => {
  const { target } = e;

  if (e.nativeEvent && (e.nativeEvent.charCode === 13 || e.nativeEvent.key === 'Enter')) {
    return true;
  }

  if (target.value[target.value.length - 1] && target.value[target.value.length - 1].charCodeAt(0) === 10) {
    return true;
  }

  return false;
};

export default isEnterPressed;
