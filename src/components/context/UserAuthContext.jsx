import React, { Component, createContext } from 'react';

export const UserAuthContext = createContext();

class UserAuthContextProvider extends Component {
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

  render() {
    const { state, props, onChange } = this;

    return (
      <UserAuthContext.Provider value={{ ...state, onChange }}>
        {props.children}
      </UserAuthContext.Provider>
    );
  }
}

export default UserAuthContextProvider;
