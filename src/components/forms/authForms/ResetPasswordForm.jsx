import React from 'react';
import PropTypes from 'prop-types';


const propTypes = {
  formMethods: PropTypes.shape({
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  userData: PropTypes.shape({
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
  }).isRequired,
};


const ResetPasswordForm = ({ formMethods, userData }) => {
  const { onSubmit, onChange } = formMethods;
  const { password, confirmPassword } = userData;

  return (
    <form action="" onSubmit={onSubmit} className="reset-password px-15">

      <label htmlFor="password" className="d-block w-100">
        <input onChange={onChange} type="password" name="password" id="password" className="w-100 px-2" value={password} required />
        <span className="form-label-text">Password</span>
      </label>

      <label htmlFor="confirmPassword" className="d-block w-100">
        <input onChange={onChange} type="password" name="confirmPassword" id="confirmPassword" className="w-100 px-2" value={confirmPassword} required />
        <span className="form-label-text">Confirm password</span>
      </label>

      <button type="submit" className="btn btn-primary btn-block my-4">Reset password</button>
    </form>
  );
};


ResetPasswordForm.propTypes = propTypes;


export default ResetPasswordForm;
