import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import boardActions from '../../actions/boardActions';
import useStatus from '../../utlis/hooks/useStatus';
import EditAccountForm from '../forms/userForms/EditAccountForm';


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
};


const EditAccountPage = (props) => {
  const {
    userData,
    token,
    board,
    editAccount,
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
          status={status}
          resetStatus={resetStatus}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  editAccount: (token, boardId, data) => dispatch(boardActions.editAccount(token, boardId, data)),
});


EditAccountPage.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(EditAccountPage);
