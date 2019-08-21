import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/messages.sass';


const messageContainerPropTypes = {
  styles: PropTypes.object,
  containerBorder: PropTypes.string.isRequired,
};

const MessageContainer = (props) => {
  const { children, styles, containerBorder } = props;
  return (
    <>
      <div className="message-container">
        <div style={styles} className={`message ${containerBorder}`}>
          {children}
        </div>
      </div>
      <div className="position-absolute w-100 h-100 bg-white loader-bg" />
    </>
  );
};

MessageContainer.propTypes = messageContainerPropTypes;


const messagePropTypes = {
  message: PropTypes.string.isRequired,
  closeMessage: PropTypes.func,
  styles: PropTypes.object,
  btn: PropTypes.bool,
  loadingTextAnimation: PropTypes.bool,
  clearInputs: PropTypes.func,
};

const ErrorMessage = (props) => {
  const {
    message,
    closeMessage,
    styles,
    btn,
    loadingTextAnimation,
    clearInputs,
  } = props;
  const animationClassName = loadingTextAnimation ? 'loading-text' : '';
  return (
    <MessageContainer style={styles} containerBorder="message-error">
      <h4 className="bg-danger">Error</h4>
      <h5 className={`${animationClassName} mt-4 w-100`}>{message}</h5>
      {btn !== false && <button onClick={() => closeMessage(clearInputs)} onKeyPress={() => closeMessage(clearInputs)} type="button" className="btn btn-danger bg-danger my-3">OK</button>}
    </MessageContainer>
  );
};

ErrorMessage.propTypes = messagePropTypes;


const InfoMessage = (props) => {
  const {
    message,
    closeMessage,
    styles,
    btn,
    loadingTextAnimation,
    clearInputs,
  } = props;
  const animationClassName = loadingTextAnimation ? 'loading-text' : '';
  return (
    <MessageContainer style={styles} containerBorder="message-info">
      <h4 className="bg-primary">Info</h4>
      <h5 className={`${animationClassName} mt-4 w-100`}>{message}</h5>
      {btn !== false && <button onClick={() => closeMessage(clearInputs)} onKeyPress={() => closeMessage(clearInputs)} type="button" className="btn btn-primary bg-primary my-3">OK</button>}
    </MessageContainer>
  );
};

InfoMessage.propTypes = messagePropTypes;


const SuccessMessage = (props) => {
  const {
    message,
    closeMessage,
    styles,
    btn,
    loadingTextAnimation,
    clearInputs,
  } = props;
  const animationClassName = loadingTextAnimation ? 'loading-text' : '';
  return (
    <MessageContainer style={styles} containerBorder="message-success">
      <h4 className="bg-success">Success</h4>
      <h5 className={`${animationClassName} mt-4 w-100`}>{message}</h5>
      {btn !== false && <button onClick={() => closeMessage(clearInputs)} onKeyPress={() => closeMessage(clearInputs)} type="button" className="btn btn-success bg-success my-3">OK</button>}
    </MessageContainer>
  );
};

SuccessMessage.propTypes = messagePropTypes;


export default { ErrorMessage, InfoMessage, SuccessMessage };
