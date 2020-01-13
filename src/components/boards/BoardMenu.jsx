import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../utils/Loader';
import Messages from '../utils/Messages';
import '../../styles/boardMenu.sass';
import BoardDescriptionForm from '../forms/boardForms/BoardDescriptionForm';
import boardActions from '../../actions/boardActions';


const propTypes = {
  token: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    activities: PropTypes.arrayOf({
      _id: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  getActivities: PropTypes.func.isRequired,
};


const BoardMenu = ({ token, board, getActivities }) => {
  const [activityCount, setActivityCount] = useState(10);
  const [status, setStatus] = useState({
    loading: false,
    success: { // for success resquest
      message: '',
      statusCode: null,
    },
    err: { // for resquest errors
      message: '',
      statusCode: null,
    },
  });

  const handleError = (err) => {
    setStatus(prevStatus => ({
      ...prevStatus,
      loading: false,
      success: {
        message: null,
        statusCode: null,
      },
      err: {
        message: err.message,
        statusCode: err.status,
      },
    }));
  };

  const loadActivities = (e) => {
    setStatus(prevStatus => ({
      ...prevStatus,
      loading: true,
    }));

    const data = { start: board.activities.length };
    return getActivities(token.token, board._id, data)
      .then((res) => {
        setStatus(prevStatus => ({
          ...prevStatus,
          loading: false,
          success: {
            message: res.data.message,
            statusCode: res.status,
          },
          err: {
            message: '',
            statusCode: null,
          },
        }));

        setActivityCount(board.activities.length);
      })
      .catch((err) => {
        handleError(err);
      });
  };

  const closeMessage = () => {
    setStatus(prevStatus => ({
      ...prevStatus,
      loading: false,
      success: {
        message: null,
        statusCode: null,
      },
      err: {
        message: null,
        statusCode: null,
      },
    }));
  };

  return (
    <div className="w-100 overflow-hidden">
      {status.err.message && <Messages.ErrorMessage message={status.err.message} closeMessage={closeMessage} btn />}
      <span className="popup-title">Menu</span>
      <BoardDescriptionForm setStatus={setStatus} handleError={handleError} />

      <span className="d-block w-100 text-center">Activity</span>
      <ul className="activity-list-container list-group">
        {board.activities.slice(0, activityCount).map(activity => <li key={activity._id} className="list-group-item">{activity.message} at {activity.date}</li>)}
      </ul>

      <div className="position-relative load-activities-btn-container mb-1">
        {
          status.loading
            ? <Loader.FormLoader />
            : (
              <button
                className="load-activities-btn btn btn-outline-dark btn-sm d-block mx-auto"
                type="button"
                onClick={loadActivities}
              >
                Load more activities
              </button>
            )
        }
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  getActivities: (token, boardId, data) => dispatch(boardActions.getActivities(token, boardId, data)),
});

BoardMenu.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(BoardMenu);
