/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/loaders.sass';


const propTypes = {
  bg: PropTypes.bool,
  bgStyles: PropTypes.object,
  bgClasses: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  bg: false,
  bgStyles: null,
  bgClasses: null,
};


const Loader = ({ bg, bgStyles, bgClasses }) => (
  <>
    <div className="position-absolute text-center w-100 h-100 loader-container">
      <div className="spinner-border mx-auto text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
    {bg && <div style={bgStyles} className={`position-absolute w-100 h-100 bg-white ${bgClasses ? bgClasses.join(' ') : ''}`} />}
  </>
);

const FormLoader = ({ bg, bgStyles }) => (
  <Loader bgClasses={['form-loader-bg']} bg={bg} bgStules={bgStyles} />
);

const PageLoader = ({ bg, bgStyles }) => (
  <Loader bgClasses={['page-loader-bg']} bg={bg} bgStules={bgStyles} />
);


Loader.propTypes = propTypes;
Loader.defaultProps = defaultProps;


export default { FormLoader, PageLoader };
