// React/Redux components
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Custom components
import Loader from '../utils/Loader';
import Messages from '../utils/Messages';
import BoardDescriptionForm from '../forms/boardForms/BoardDescriptionForm';

// Custom hooks
import useStatus from '../../utlis/hooks/useStatus';

// mapState and actions
import { mapStateToProps } from '../../utlis/reduxMapFunction';
import boardActions from '../../actions/boardActions';

// Styles
import '../../styles/boardMenu.sass';


const propTypes = {
  token: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    activities: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  getActivities: PropTypes.func.isRequired,
  cleanActivities: PropTypes.func.isRequired,
};


const BoardMenu = ({ token, board, getActivities, cleanActivities }) => {
  const [activityCount, setActivityCount] = useState(10); // activityCount is a start index for requesting activities from activities array on the server
  const {
    status,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  } = useStatus();

  const loadActivities = () => {
    setStatusLoading();

    const data = { start: board.activities.length };
    return getActivities(token.token, board._id, data)
      .then((res) => {
        handleSuccess(res);
        setActivityCount(res.data.activities.length);
      })
      .catch(handleError);
  };

  const closeMessage = () => {
    resetStatus();
  };

  useEffect(() => () => {
    cleanActivities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-100 overflow-hidden board-menu-container">
      {status.err.message && <Messages.ErrorMessage message={status.err.message} closeMessage={closeMessage} btn />}
      <span className="popup-title">Menu</span>
      <BoardDescriptionForm handleError={handleError} />

      <div className="activity-container">
        <span className="d-block w-100 text-center pb-1">Activity</span>
        <ul className="activity-list-container list-group">
          {board.activities.slice(0, activityCount).map((activity) => {
            const todayStr = new Date().toLocaleDateString();
            const activityDate = new Date(activity.date);
            const activityDateStr = activityDate.toLocaleDateString();

            return <li key={activity._id} className="list-group-item">{activity.message} at {todayStr === activityDateStr ? activityDate.toLocaleTimeString() : activityDateStr}</li>;
          })}
        </ul>

        <div className="position-relative load-activities-btn-container mb-1">
          {status.loading
            ? <Loader.FormLoader />
            : (
              <button
                className="load-activities-btn btn btn-outline-dark btn-sm d-block mx-auto"
                type="button"
                onClick={loadActivities}
              >
                Load more activities
              </button>
            )}
        </div>
      </div>

    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  getActivities: (token, boardId, data) => dispatch(boardActions.getActivities(token, boardId, data)),
  cleanActivities: () => dispatch(boardActions.cleanActivities()),
});

BoardMenu.propTypes = propTypes;


export default connect(mapStateToProps.mapRequestData, mapDispatchToProps)(BoardMenu);
