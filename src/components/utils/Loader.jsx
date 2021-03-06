/* eslint-disable object-curly-newline */
/* eslint-disable react/forbid-prop-types */
// React/Redux components
import React from 'react';
import PropTypes from 'prop-types';

// Styles
import '../../styles/loaders.sass';


const propTypes = {
  bg: PropTypes.bool,
  bgStyles: PropTypes.object,
  bgClasses: PropTypes.arrayOf(PropTypes.string),
  style: PropTypes.object,
};

const defaultProps = {
  bg: false,
  bgStyles: null,
  bgClasses: null,
  style: null,
};


const Loader = ({ bg, bgStyles, bgClasses, style }) => (
  <>
    <div style={style} className="position-absolute text-center w-100 h-100 loader-container">
      <div className="spinner-border mx-auto text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
    {bg && <div style={bgStyles} className={`position-absolute w-100 h-100 bg-white ${bgClasses ? bgClasses.join(' ') : ''}`} />}
  </>
);

const FormLoader = ({ bg, bgStyles, style }) => (
  <Loader bgClasses={['form-loader-bg']} bg={bg} bgStyles={bgStyles} style={style} />
);

const PageLoader = ({ bg, bgStyles, style }) => (
  <Loader bgClasses={['page-loader-bg']} bg={bg} bgStyles={bgStyles} style={style} />
);


Loader.propTypes = propTypes;
Loader.defaultProps = defaultProps;


export default { FormLoader, PageLoader };
