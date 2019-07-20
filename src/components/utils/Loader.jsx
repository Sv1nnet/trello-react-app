import React from 'react';
import '../../styles/loaders.sass';

const FormLoader = () => (
  <>
    <div className="position-absolute text-center w-100 h-100 loader-container">
      <div className="spinner-border mx-auto text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
    <div className="position-absolute w-100 h-100 bg-white loader-bg" />
  </>
);

export default { FormLoader };
