/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../utils/TextInput';

const MembersForm = (props) => {
  const { members } = props;
  const [state, setState] = useState({
    // isReadonly: props.isReadonly,
  });

  const handleChange = (e) => {
    setState({ ...state, isReadonly: e.target.value === 'readonly' });
    console.log(state);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(state);
  };

  return (
    <form action="" className="w-100">
      <span className="popup-title text-dark">Members</span>

      <div className="input-container">
        <label htmlFor="titlename">Find user</label>
        <TextInput
          classList="members-board-input"
          name="titlename"
          id="titlename"
          placeholder="Find user by email"
          hideSearchBtn
        />
      </div>

      <ul className="list-group user-list">

        {members.map(member => (
          <li key={member.email} className="list-group-item d-flex align-items-center user-list-item">

            <div className="user-logo-container">
              <span className="p-0 ml-1 text-primary rounded-circle bg-white text-center font-weight-bold user-logo">{(`${member.nickname[0]}${member.nickname[1]}`).toUpperCase()}</span>
            </div>

            <div className="credentials-container">
              <div className="credentials-email-container">
                <span className="credentials-nickname">
                  {member.nickname}
                </span>
              </div>
              <div className="credentails-nickname-container">
                <span className="credentials-email">
                  {member.email}
                </span>
              </div>
            </div>

            <div className="member-controls">
              <button type="button" className="member-control-btn btn btn-sm btn-danger">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

          </li>
        ))}

      </ul>
    </form>
  );
};

export default MembersForm;
