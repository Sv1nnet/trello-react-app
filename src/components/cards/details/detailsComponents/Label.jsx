import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import '../../../../styles/label.sass';


const propTypes = {
  title: PropTypes.string,
  color: PropTypes.string.isRequired,
  events: PropTypes.shape({}),
};

const defaultProps = {
  title: '',
  events: {},
};


const Label = ({ title, color, isTitleRevealed, events }) => {
  const labelRef = useRef(null);

  return (
    <div className={`label-container ${isTitleRevealed ? 'revealed' : ''}`}>
      <div ref={labelRef} tabIndex="0" role="button" className="label-content" style={{ backgroundColor: color }} onClick={(e) => { events.onClick(e, labelRef.current); }}>{isTitleRevealed && title}</div>
    </div>
  );
};


Label.propTypes = propTypes;
Label.defaultProps = defaultProps;


export default Label;
