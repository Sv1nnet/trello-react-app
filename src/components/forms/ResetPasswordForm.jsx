import React, { useState } from 'react';

const ResetPasswordForm = (props) => {
  const [mounted, setMounted] = useState(false);

  const { formMethods, userData } = props;
  const { onChange, onSubmit } = formMethods;
  const {
    email,
  } = userData;

  // Fadein component
  setTimeout(() => setMounted(true), 50);

  return (
    <form action="" className={`${mounted && 'active'}`}>
      <label htmlFor="email" className="d-block w-100">
        <input onChange={onChange} type="email" name="email" id="email" className="w-100 px-2" value={email} />
        <span className="form-label-text">Email</span>
      </label>

      <button type="submit" className="btn btn-primary btn-block my-4">Reset password</button>
    </form>
  );
};

export default ResetPasswordForm;
