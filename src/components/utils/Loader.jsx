import React from 'react';
import '../../styles/loaders.sass';

const LoaderBody = () => (
  <div className="position-absolute text-center w-100 h-100 loader-container">
    <div className="spinner-border mx-auto text-primary" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

const FormLoader = (props) => {
  const { bg, bgStyles } = props;
  return (
    <>
      <LoaderBody />
      {bg !== false && <div style={bgStyles || {}} className="position-absolute w-100 h-100 bg-white form-loader-bg" />}
    </>
  );
};

const PageLoader = (props) => {
  const { bg, bgStyles } = props;
  return (
    <>
      <LoaderBody />
      {bg !== false && <div style={bgStyles || {}} className="position-absolute w-100 h-100 bg-white page-loader-bg" />}
    </>
  );
};

export default { FormLoader, PageLoader };
