import React, { Component } from 'react';
import Loader from '../utils/Loader';

class AuthFormHolder extends Component {
  state = {
    userData: {
      email: '',
      nickname: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    status: {
      loading: false,
      err: undefined,
    },
  }

  onChange = (e) => {
    const { target } = e;

    this.setState(state => ({
      ...state,
      userData: {
        ...state.userData,
        [target.name]: target.value,
      },
    }));
  }

  onSubmit = (e) => {
    e.preventDefault();

    this.setState(state => ({
      ...state,
      status: {
        ...state.status,
        loading: true,
      },
    }));
  }

  render() {
    const {
      state,
      props,
      onChange,
      onSubmit,
    } = this;
    const { switchForm } = props;
    const { userData, status } = state;
    const { loading } = status;
    const AuthForm = props.authForm;

    return (
      <>
        <AuthForm switchForm={switchForm} userData={userData} formMethods={{ onChange, onSubmit }} />
        {loading && <Loader.FormLoader />}
      </>
    );
  }
}

export default AuthFormHolder;
