import React, { Component } from 'react';

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

  onSubmit = () => {

  }

  render() {
    const { state, props } = this;
    const { switchForm } = props;
    const { userData } = state;
    const AuthForm = props.authForm;

    return (
      <AuthForm switchForm={switchForm} userData={userData} onChange={this.onChange} />
    );
  }
}

export default AuthFormHolder;
