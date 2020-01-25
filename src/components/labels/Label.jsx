import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/label.sass';


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
  return (
    <div className={`label-container ${isTitleRevealed ? 'revealed' : ''}`}>
      <div tabIndex="0" role="button" className="label-content" style={{ backgroundColor: color }} {...events}>{isTitleRevealed && title}</div>
    </div>
  );
};


Label.propTypes = propTypes;
Label.defaultProps = defaultProps;


export default Label;
