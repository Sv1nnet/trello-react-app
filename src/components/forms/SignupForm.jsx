import React, { useState } from 'react';
import { formActionTypes } from '../../types';

const SignupForm = (props) => {
  const [mounted, setMounted] = useState(false);

  const { formMethods, userData } = props;
  const { onChange, onSubmit } = formMethods;
  const {
    email,
    nickname,
    password,
    confirmPassword,
    firstName,
    lastName,
  } = userData;

  // Fadein component
  setTimeout(() => setMounted(true), 50);

  return (
    <form action="" onSubmit={e => onSubmit(e, formActionTypes.SIGNUP)} className={`${mounted && 'active'}`}>
      <label htmlFor="email" className="d-block w-100">
        <input onChange={onChange} type="email" name="email" id="email" className="w-100 px-2" value={email} />
        <span className="form-label-text">Email</span>
      </label>

      <label htmlFor="nickname" className="d-block w-100">
        <input onChange={onChange} type="text" name="nickname" id="nickname" className="w-100 px-2" value={nickname} />
        <span className="form-label-text">Nickname</span>
      </label>

      <label htmlFor="password" className="d-block w-100">
        <input onChange={onChange} type="password" name="password" id="password" className="w-100 px-2" value={password} />
        <span className="form-label-text">Password</span>
      </label>

      <label htmlFor="confirmPassword" className="d-block w-100">
        <input onChange={onChange} type="password" name="confirmPassword" id="confirmPassword" className="w-100 px-2" value={confirmPassword} />
        <span className="form-label-text">Confirm password</span>
      </label>

      <label htmlFor="firstName" className="d-block w-100">
        <input onChange={onChange} type="text" name="firstName" id="firstName" className="w-100 px-2" value={firstName} />
        <span className="form-label-text">First Name</span>
      </label>

      <label htmlFor="lastName" className="d-block w-100">
        <input onChange={onChange} type="text" name="lastName" id="lastName" className="w-100 px-2" value={lastName} />
        <span className="form-label-text">Last Name</span>
      </label>

      <button type="submit" className="btn btn-primary btn-block my-4">Sign up</button>
    </form>
  );
};

export default SignupForm;
