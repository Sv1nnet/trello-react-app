import React from 'react';
import PropTypes from 'prop-types';


const defaultProps = {
  height: '0',
  width: '0',
};

const propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
};


const DragPlaceholder = ({ height, width }) => (
  <div className="drag-placeholder dragging" style={{ height, width }} />
);


DragPlaceholder.defaultProps = defaultProps;
DragPlaceholder.propTypes = propTypes;


export default DragPlaceholder;
