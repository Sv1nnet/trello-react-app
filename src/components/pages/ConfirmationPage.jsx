import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Messages from '../utils/Messages';
import action from '../../actions/authActions';


const propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      confToken: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  confirmEmail: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};


// This component just sends confirm request so it has to have loading state initialy. We render the component when user comes from email link to confirm his email.
class ConfirmationPage extends Component {
  constructor(props) {
    super(props);

    this._mounted = false; // For preventing async actions if component unmounted
  }

  state = {
    loading: true, // Component has loading state from the start
    result: {
      err: undefined,
      message: '',
    },
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  closeMessage = () => {
    const { history } = this.props;
    history.push('/');
  };

  handleNoConnection = () => {
    this.setState(() => ({
      loading: false,
      result: {
        err: 503,
        message: 'No connection with the server',
      },
    }));
  }

  render() {
    const { state, closeMessage, _mounted } = this;
    const { match, confirmEmail, history } = this.props;
    const { confToken } = match.params;

    if (state.loading) {
      confirmEmail(confToken).then((res) => {
        if (res && res.status === 200) { // If token is valid we get 200 status
          history.push('/'); // Go to the main page
          if (!_mounted) return; // Prevent unmounted component from async action like setState
        }

        if (!res) { // If there is no response from server
          this.handleNoConnection();
        } else { // If there is response but status is not 200 (token is invalid)
          this.setState(() => ({
            loading: false,
            result: {
              err: res.status,
              message: res.data.err,
            },
          }));
        }
      });
    }

    // Render either loading info message if request is being sent or error message if request failed
    return (
      <div className="">
        {state.loading && <Messages.InfoMessage loadingTextAnimation styles={{ height: '115px' }} btn={false} message="Sending" />}
        {state.result.err && <Messages.ErrorMessage message={state.result.message} closeMessage={closeMessage} />}
      </div>
    );
  }
}

// Get access to confirm email action
const mapDispatchToProps = dispatch => ({
  confirmEmail: token => dispatch(action.confirmEmail(token)),
});


ConfirmationPage.propTypes = propTypes;


export default connect(null, mapDispatchToProps)(ConfirmationPage);
