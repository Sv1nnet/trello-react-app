import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from './DragDropContext';


const Placeholder = ({ elementToPlaceHold, containerId }) => {
  const {
    draggableHTMLElements,
    dragState,
  } = useContext(DragDropContext);

  if (!elementToPlaceHold) return null;

  const computedStyle = getComputedStyle(elementToPlaceHold);
  const placeholderStyle = {
    minWidth: `${elementToPlaceHold.offsetWidth}px`,
    height: `${elementToPlaceHold.offsetHeight}px`,
    marginLeft: computedStyle.marginLeft,
    marginRight: computedStyle.marginRight,
    marginTop: computedStyle.marginTop,
    marginBottom: computedStyle.marginBottom,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    display: 'none',
  };

  return <div data-placeholder={containerId} style={placeholderStyle} />;
};


Placeholder.propTypes = {

};


export default Placeholder;
