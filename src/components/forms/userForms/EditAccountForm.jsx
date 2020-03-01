import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import '../../../styles/editAccount.sass';
import Loader from '../../utils/Loader';
import Messages from '../../utils/Messages';


const propTypes = {
  nickname: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  newPassword: PropTypes.string.isRequired,
  currentPassword: PropTypes.string.isRequired,
  submitState: PropTypes.shape({
    status: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      success: PropTypes.shape({
        statusCode: PropTypes.number,
        message: PropTypes.string,
      }).isRequired,
      err: PropTypes.shape({
        statusCode: PropTypes.number,
        message: PropTypes.string,
      }).isRequired,
    }).isRequired,
    resetStatus: PropTypes.func.isRequired,
  }).isRequired,
  resetPasswordState: PropTypes.shape({
    passwordStatus: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      success: PropTypes.shape({
        statusCode: PropTypes.number,
        message: PropTypes.string,
      }).isRequired,
      err: PropTypes.shape({
        statusCode: PropTypes.number,
        message: PropTypes.string,
      }).isRequired,
    }).isRequired,
    resetPasswordStatus: PropTypes.func.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};


const EditAccountForm = (props) => {
  const {
    nickname,
    email,
    firstName,
    lastName,
    newPassword,
    currentPassword,
    submitState,
    resetPasswordState,
    onChange,
    onSubmit,
    resetPassword,
  } = props;

  const { status, resetStatus } = submitState;
  const { passwordStatus, resetPasswordStatus } = resetPasswordState;

  return (
    <>
      <div className="col-11 col-md-6 col-l-4 col-xl-4 edit-account-form bg-white">
        <form action="" onSubmit={onSubmit}>
          <label htmlFor="nickname" className="d-block w-100">
            <input onChange={onChange} type="text" name="nickname" id="nickname" className="w-100 px-2" value={nickname} required />
            <span className="form-label-text">Nickname<span className="text-danger"> *</span></span>
          </label>

          <label htmlFor="email" className="d-block w-100">
            <input onChange={onChange} type="email" name="email" id="email" className="w-100 px-2" value={email} required />
            <span className="form-label-text">Email<span className="text-danger"> *</span></span>
          </label>

          <label htmlFor="first-mame" className="d-block w-100">
            <input onChange={onChange} type="text" name="firstName" id="first-name" className="w-100 px-2" value={firstName} required />
            <span className="form-label-text">First Name<span className="text-danger"> *</span></span>
          </label>

          <label htmlFor="last-mame" className="d-block w-100">
            <input onChange={onChange} type="text" name="lastName" id="last-name" className="w-100 px-2" value={lastName} required />
            <span className="form-label-text">Last Name<span className="text-danger"> *</span></span>
          </label>

          <label htmlFor="new-password" className="d-block w-100">
            <input onChange={onChange} type="password" name="newPassword" id="new-password" className="w-100 px-2" value={newPassword} />
            <span className="form-label-text">New Password</span>
          </label>

          <label htmlFor="current-password" className="d-block w-100">
            <input onChange={onChange} type="password" name="currentPassword" id="current-password" className="w-100 px-2" value={currentPassword} required />
            <span className="form-label-text">Current Password<span className="text-danger"> *</span></span>
          </label>
          <div className="position-relative edit-account-form__submit-btn-container mt-4 mb-3">
            {
              status.loading
                ? <Loader.FormLoader />
                : <button type="submit" className="btn btn-primary btn-block">Save</button>
            }
          </div>
        </form>

        {
          <div className="edit-account-form__reset-password-btn-container">
            {passwordStatus.loading
              ? (
                <button type="button" className="edit-account-form__reset-password-btn edit-account-form__reset-password-btn_loading" onClick={resetPassword}>
                  <div className="reset-password-btn__loader" />
                </button>
              )
              : (
                <button type="button" className="edit-account-form__reset-password-btn" onClick={resetPassword}>
                  Reset password
                </button>
              )
            }
          </div>}
      </div>

      {status.success.statusCode === 200 && ReactDOM.createPortal(
        <Messages.SuccessMessage message={status.success.message} closeMessage={resetStatus} btn />,
        document.body,
      )}

      {status.err.message && ReactDOM.createPortal(
        <Messages.ErrorMessage message={status.err.message} closeMessage={resetStatus} btn />,
        document.body,
      )}

      {passwordStatus.success.statusCode === 200 && ReactDOM.createPortal(
        <Messages.SuccessMessage message={passwordStatus.success.message} closeMessage={resetPasswordStatus} btn />,
        document.body,
      )}

      {passwordStatus.err.message && ReactDOM.createPortal(
        <Messages.ErrorMessage message={passwordStatus.err.message} closeMessage={resetPasswordStatus} btn />,
        document.body,
      )}
    </>
  );
};


EditAccountForm.propTypes = propTypes;


export default EditAccountForm;
