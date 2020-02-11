import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/messages.sass';


const messageContainerPropTypes = {
  styles: PropTypes.shape({}),
  containerBorder: PropTypes.string.isRequired,
};

const messageContainerDefaultProps = {
  styles: {},
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
MessageContainer.defaultProps = messageContainerDefaultProps;


const messagePropTypes = {
  message: PropTypes.string.isRequired,
  closeMessage: PropTypes.func,
  styles: PropTypes.shape({}),
  btn: PropTypes.bool,
  loadingTextAnimation: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  dataForClosingMessage: PropTypes.any,
};

const messageDefaultProps = {
  closeMessage: () => { },
  styles: {},
  btn: true,
  loadingTextAnimation: false,
  dataForClosingMessage: undefined,
};

const ErrorMessage = (props) => {
  const {
    message,
    closeMessage,
    styles,
    btn,
    loadingTextAnimation,
    dataForClosingMessage,
  } = props;
  const animationClassName = loadingTextAnimation ? 'loading-text' : '';
  return (
    <MessageContainer style={styles} containerBorder="message-danger">
      <h4 className="bg-danger">Error</h4>
      <h5 className={`${animationClassName} mt-4 w-100`}>{message}</h5>
      {btn !== false && <button onClick={() => closeMessage(dataForClosingMessage)} onKeyPress={() => closeMessage(dataForClosingMessage)} type="button" className="btn btn-danger bg-danger my-3">OK</button>}
    </MessageContainer>
  );
};

ErrorMessage.propTypes = messagePropTypes;
ErrorMessage.defaultProps = messageDefaultProps;


const InfoMessage = (props) => {
  const {
    message,
    closeMessage,
    styles,
    btn,
    loadingTextAnimation,
    dataForClosingMessage,
  } = props;
  const animationClassName = loadingTextAnimation ? 'loading-text' : '';
  return (
    <MessageContainer style={styles} containerBorder="message-info">
      <h4 className="bg-primary">Info</h4>
      <h5 className={`${animationClassName} mt-4 w-100`}>{message}</h5>
      {btn !== false && <button onClick={() => closeMessage(dataForClosingMessage)} onKeyPress={() => closeMessage(dataForClosingMessage)} type="button" className="btn btn-primary bg-primary my-3">OK</button>}
    </MessageContainer>
  );
};

InfoMessage.propTypes = messagePropTypes;
InfoMessage.defaultProps = messageDefaultProps;


const SuccessMessage = (props) => {
  const {
    message,
    closeMessage,
    styles,
    btn,
    loadingTextAnimation,
    dataForClosingMessage,
  } = props;
  const animationClassName = loadingTextAnimation ? 'loading-text' : '';
  return (
    <MessageContainer style={styles} containerBorder="message-success">
      <h4 className="bg-success">Success</h4>
      <h5 className={`${animationClassName} mt-4 w-100`}>{message}</h5>
      {btn !== false && <button onClick={() => closeMessage(dataForClosingMessage)} onKeyPress={() => closeMessage(dataForClosingMessage)} type="button" className="btn btn-success bg-success my-3">OK</button>}
    </MessageContainer>
  );
};

SuccessMessage.propTypes = messagePropTypes;
SuccessMessage.defaultProps = messageDefaultProps;


const questionMessagePropTypes = {
  type: PropTypes.oneOf(['error', 'info', 'success']),
  message: PropTypes.string.isRequired,
  answer: PropTypes.shape({
    positive: PropTypes.func.isRequired,
    negative: PropTypes.func.isRequired,
  }).isRequired,
  styles: PropTypes.shape({}),
};

const questionMessageDefaultProps = {
  type: 'info',
  styles: {},
};

const QuestionMessage = (props) => {
  const {
    type,
    message,
    answer,
    styles,
  } = props;

  const colors = {
    error: 'danger',
    info: 'primary',
    success: 'success',
  };

  const colorType = colors[type] || 'primary';

  return (
    <MessageContainer style={styles} containerBorder={`message-${colorType}`}>
      <h4 className={`bg-${colorType}`}>Confirm</h4>
      <h5 className="mt-4 w-100">{message}</h5>
      <div className="question-message__buttons-container">
        <button onClick={answer.positive} onKeyPress={answer.positive} type="button" className="question-message-btn btn btn-outline-success my-3">Yes</button>
        <button onClick={answer.negative} onKeyPress={answer.negative} type="button" className="question-message-btn btn btn-outline-danger my-3">No</button>
      </div>
    </MessageContainer>
  );
};

QuestionMessage.propTypes = questionMessagePropTypes;
QuestionMessage.defaultProps = questionMessageDefaultProps;


export default { ErrorMessage, InfoMessage, SuccessMessage, QuestionMessage };
