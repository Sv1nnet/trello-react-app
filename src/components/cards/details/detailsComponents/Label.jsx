// React/Redux components
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

// Styles
import '../../../../styles/label.sass';


const propTypes = {
  title: PropTypes.string,
  color: PropTypes.string.isRequired,
  isTitleRevealed: PropTypes.bool,
  events: PropTypes.shape({}),
};

const defaultProps = {
  title: '',
  isTitleRevealed: false,
  events: {},
};


const Label = ({ title, color, isTitleRevealed, events }) => {
  const labelRef = useRef(null);

  const onClick = (e) => {
    if (events.onClick) events.onClick(e, labelRef.current);
  };

  return (
    <div className={`label-container ${isTitleRevealed ? 'revealed' : ''}`}>
      <div ref={labelRef} tabIndex="0" role="button" className="label-content" style={{ backgroundColor: color }} onClick={onClick} onKeyPress={onClick}>{isTitleRevealed && title}</div>
    </div>
  );
};


Label.propTypes = propTypes;
Label.defaultProps = defaultProps;


export default Label;
