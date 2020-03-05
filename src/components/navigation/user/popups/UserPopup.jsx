// React/Redux components
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Custom components
import PopupContainer from '../../../utils/PopupContainer';


const propTypes = {
  logout: PropTypes.func.isRequired,
  onPopupBtnClick: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
  }).isRequired,
};


const UserPopup = (props) => {
  const {
    logout,
    onPopupBtnClick,
    userData,
  } = props;
  const { email, nickname } = userData;

  return (
    <PopupContainer popupToClose="userPopupActive" classesToNotClosePopup={['user-credentials']} targetClasses={['dropdown-user', 'user-credentials']} extraClasses={['dropdown-user']} removeElement={onPopupBtnClick} userData={{ email, nickname }}>
      <div className="col-12 dropdown-user-credentials pt-2 border-bottom">
        <p className="user-credentials text-center">{`${email} (${nickname})`}</p>
      </div>

      <div className="col-12 px-0 dropdown-user-credentials pt-2 pb-2 border-bottom">
        <Link className="text-center w-100 d-block" to="/user">Edit account</Link>
      </div>

      <div className="col-12 px-0 dropdown-user-credentials pt-2">
        <Link onClick={logout} className="text-center w-100 d-block" to="/logout">Log out</Link>
      </div>
    </PopupContainer>
  );
};


UserPopup.propTypes = propTypes;


export default UserPopup;
