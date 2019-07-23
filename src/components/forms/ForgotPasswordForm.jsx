import React, { useState } from 'react';
import { formActionTypes } from '../../types';

const ForgotPasswordForm = (props) => {
  const [mounted, setMounted] = useState(false);

  const { formMethods, userData } = props;
  const { onChange, onSubmit } = formMethods;
  const {
    email,
  } = userData;

  // Fadein component
  setTimeout(() => setMounted(true), 50);

  return (
    <form action="" onSubmit={e => onSubmit(e, formActionTypes.FORGOT_PASSWORD)} className={`${mounted && 'active'}`}>
      <label htmlFor="email" className="d-block w-100">
        <input onChange={onChange} type="email" name="email" id="email" className="w-100 px-2" value={email} required />
        <span className="form-label-text">Email</span>
      </label>

      <button type="submit" className="btn btn-primary btn-block my-4">Reset password</button>
    </form>
  );
};

export default ForgotPasswordForm;
