// React/Redux components
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Custom components
import EditAccountForm from '../forms/userForms/EditAccountForm';

// Custom hooks
import useStatus from '../../utlis/hooks/useStatus';

// mapState and actions
import { mapStateToProps } from '../../utlis/reduxMapFunction';
import boardActions from '../../actions/boardActions';
import authActions from '../../actions/authActions';


const propTypes = {
  userData: PropTypes.shape({
    nickname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  token: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  editAccount: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
};


const EditAccountPage = (props) => {
  const {
    userData,
    token,
    board,
    editAccount,
    resetPassword,
  } = props;


  const [userDetails, setUserDetails] = useState({
    nickname: userData.nickname,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    newPassword: '',
    currentPassword: '',
  });

  const {
    status,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  } = useStatus();

  const {
    status: passwordStatus,
    setStatusLoading: setPasswordStatusLoading,
    resetStatus: resetPasswordStatus,
    handleSuccess: handlePasswordSuccess,
    handleError: handlePasswordError,
  } = useStatus();

  const onChange = (e) => {
    const { target } = e;

    setUserDetails(state => ({
      ...state,
      [target.name]: target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setStatusLoading();

    editAccount(token.token, board._id, userDetails)
      .then((res) => {
        handleSuccess(res);
        setUserDetails(state => ({
          ...state,
          newPassword: '',
          currentPassword: '',
        }));
      })
      .catch(handleError);
  };

  const sendResetPasswordEmail = (e) => {
    const { email } = userData;

    setPasswordStatusLoading();

    // setTimeout(resetPasswordStatus, 5000);
    resetPassword({ email })
      .then(handlePasswordSuccess)
      .catch(handlePasswordError);
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center mt-1">
        <h2 className="col-12 text-center">Your Account</h2>
        <EditAccountForm
          nickname={userDetails.nickname}
          email={userDetails.email}
          firstName={userDetails.firstName}
          lastName={userDetails.lastName}
          newPassword={userDetails.newPassword}
          currentPassword={userDetails.currentPassword}
          submitState={{ status, resetStatus }}
          resetPasswordState={{ passwordStatus, resetPasswordStatus }}
          onChange={onChange}
          onSubmit={onSubmit}
          resetPassword={sendResetPasswordEmail}
        />
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  editAccount: (token, boardId, data) => dispatch(boardActions.editAccount(token, boardId, data)),
  resetPassword: data => dispatch(authActions.forgotPassword(data)),
});


EditAccountPage.propTypes = propTypes;


export default connect(mapStateToProps.mapFullUserData, mapDispatchToProps)(EditAccountPage);
