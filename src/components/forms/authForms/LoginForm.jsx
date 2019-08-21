import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formActionTypes } from '../../../types';


const propTypes = {
  userData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  formMethods: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }).isRequired,
  switchForm: PropTypes.func.isRequired,
};


const LoginForm = ({ formMethods, userData, switchForm }) => {
  const [mounted, setMounted] = useState(false);

  const { onChange, onSubmit } = formMethods;
  const { email, password } = userData;

  // Fadein component
  setTimeout(() => setMounted(true), 50);

  return (
    <form action="" onSubmit={e => onSubmit(e, formActionTypes.LOGIN)} className={`mb-3 ${mounted && 'active'}`}>
      <label htmlFor="email" className="d-block w-100">
        <input onChange={onChange} type="email" name="email" id="email" className="w-100 px-2" value={email} required />
        <span className="form-label-text">Email</span>
      </label>

      <label htmlFor="password" className="d-block w-100">
        <input onChange={onChange} type="password" name="password" id="password" className="w-100 px-2" value={password} required />
        <span className="form-label-text">Password</span>
      </label>

      <button type="submit" className="btn btn-primary btn-block mt-4 mb-3">Log in</button>

      <Link to="/" onClick={(e) => { e.preventDefault(); switchForm({ resetPassword: true }); }}>Forgor password</Link>
    </form>
  );
};


LoginForm.propTypes = propTypes;


export default LoginForm;
