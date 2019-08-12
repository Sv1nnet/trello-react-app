import React from 'react';
import '../../styles/loaders.sass';

const Loader = (props) => {
  const { bg, bgStyles, bgClasses } = props;

  return (
    <>
      <div className="position-absolute text-center w-100 h-100 loader-container">
        <div className="spinner-border mx-auto text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      {bg !== false && <div style={bgStyles || {}} className={`position-absolute w-100 h-100 bg-white ${bgClasses ? bgClasses.join(' ') : ''}`} />}
    </>
  );
};

const FormLoader = (props) => {
  const { bg, bgStyles } = props;
  return (
    <Loader bgClasses={['form-loader-bg']} bg={!!bg} bgStules={bgStyles} />
  );
};

const PageLoader = (props) => {
  const { bg, bgStyles } = props;
  return (
    <Loader bgClasses={['page-loader-bg']} bg={!!bg} bgStules={bgStyles} />
  );
};

export default { FormLoader, PageLoader };
