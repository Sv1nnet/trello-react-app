import React from 'react';
import '../../styles/messages.sass';

const MessageContaner = (props) => {
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

const ErrorMessage = (props) => {
  const {
    message,
    closeMessage,
    styles,
    btn,
    loadingTextAnimation,
    clearInputs,
  } = props;
  return (
    <MessageContaner style={styles} containerBorder="message-error">
      <h4 className="bg-danger">Error</h4>
      <h5 className={`${loadingTextAnimation && 'loading-text'} mt-4 w-100`}>{message}</h5>
      {btn !== false && <button onClick={() => closeMessage(clearInputs)} onKeyPress={() => closeMessage(clearInputs)} type="button" className="btn btn-danger bg-danger my-3">OK</button>}
    </MessageContaner>
  );
};

const InfoMessage = (props) => {
  const {
    message,
    closeMessage,
    styles,
    btn,
    loadingTextAnimation,
    clearInputs,
  } = props;
  return (
    <MessageContaner style={styles} containerBorder="message-info">
      <h4 className="bg-primary">Info</h4>
      <h5 className={`${loadingTextAnimation && 'loading-text'} mt-4 w-100`}>{message}</h5>
      {btn !== false && <button onClick={() => closeMessage(clearInputs)} onKeyPress={() => closeMessage(clearInputs)} type="button" className="btn btn-primary bg-primary my-3">OK</button>}
    </MessageContaner>
  );
};

const SuccessMessage = (props) => {
  const {
    message,
    closeMessage,
    styles,
    btn,
    loadingTextAnimation,
    clearInputs,
  } = props;
  return (
    <MessageContaner style={styles} containerBorder="message-success">
      <h4 className="bg-success">Success</h4>
      <h5 className={`${loadingTextAnimation && 'loading-text'} mt-4 w-100`}>{message}</h5>
      {btn !== false && <button onClick={() => closeMessage(clearInputs)} onKeyPress={() => closeMessage(clearInputs)} type="button" className="btn btn-success bg-success my-3">OK</button>}
    </MessageContaner>
  );
};

export default { ErrorMessage, InfoMessage, SuccessMessage };
