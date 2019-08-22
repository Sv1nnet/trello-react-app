import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCrown, faPlus } from '@fortawesome/free-solid-svg-icons';
import Loader from '../utils/Loader';


const propTypes = {
  userId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  isMember: PropTypes.bool.isRequired,
  addMember: PropTypes.func.isRequired,
  removeMember: PropTypes.func.isRequired,
};


const UserListItem = ({ userId, email, nickname, isMember, isOwner, disabled, addMember, removeMember }) => {
  const [state, setState] = useState({
    loading: false,
    isMember,
  });

  const sendRequest = (request) => {
    request(userId)
      .then(() => setState({ ...state, loading: false, isMember: !state.isMember }))
      .catch(() => setState({ ...state, loading: false }));

    setState({
      ...state,
      loading: true,
    });
  };

  const renderButton = () => {
    if (state.loading) {
      return (
        <button type="button" className="member-control-btn btn btn-sm position-relative">
          <Loader.PageLoader />
        </button>
      );
    }

    // If uesr owner then we can't remove him from baord member so we need disable button
    if (isOwner) {
      return (
        <button type="button" className="member-control-btn btn btn-sm btn-danger owner" disabled>
          <FontAwesomeIcon className="w-100" icon={faTimes} />
        </button>
      );
    }

    const isDisabled = {};

    if (!isOwner && disabled) {
      isDisabled.disabled = disabled;
    }

    return state.isMember // If user is a board member then show remove-button otherwise show add-button
      ? ( // Remove member button
        <button onClick={() => sendRequest(removeMember)} type="button" className="member-control-btn btn btn-sm btn-danger" {...isDisabled}>
          <FontAwesomeIcon className="w-100" icon={faTimes} />
        </button>
      )
      : ( // Add member button
        <button onClick={() => sendRequest(addMember)} type="button" className="member-control-btn btn btn-sm btn-success" {...isDisabled}>
          <FontAwesomeIcon className="w-100" icon={faPlus} />
        </button>
      );
  };

  return (
    <li className="list-group-item d-flex align-items-center user-list-item">

      <div className="user-logo-container">
        {isOwner && ( // If user is an board owner then whow crown icon above him
          <div className="owner-icon-container ml-1">
            <FontAwesomeIcon icon={faCrown} />
          </div>
        )}
        <span className="p-0 ml-1 text-primary rounded-circle bg-white text-center font-weight-bold user-logo">{(`${nickname[0]}${nickname[1]}`).toUpperCase()}</span>
      </div>

      <div className="credentials-container">
        <div className="credentials-email-container">
          <span className="credentials-nickname">
            {nickname}
          </span>
        </div>
        <div className="credentails-nickname-container">
          <span className="credentials-email">
            {email}
          </span>
        </div>
      </div>

      <div className="member-controls">
        {renderButton()}
      </div>

    </li>
  );
};


UserListItem.propTypes = propTypes;


export default UserListItem;
