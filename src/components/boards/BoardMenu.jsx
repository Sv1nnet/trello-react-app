import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInput from '../utils/TextInput';
import Loader from '../utils/Loader';
import '../../styles/boardMenu.sass';


const BoardMenu = (props) => {
  const { board } = props;
  const [boardDescription, setBoardDescription] = useState(board.description);
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
  const interval = useRef(null);

  const onChange = (e) => {
    const { target } = e;

    setBoardDescription(target.value);
  };

  const loadActivities = (e) => {
    setStatus(prevStatus => ({
      ...prevStatus,
      loading: true,
    }));

    interval.current = setTimeout(() => {
      setStatus(prevStatus => ({
        ...prevStatus,
        loading: false,
      }));
    }, 3000);
  };

  useEffect(() => () => {
    clearInterval(interval.current);
  }, []);

  return (
    <div className="w-100 overflow-hidden">
      <span className="popup-title">Menu</span>
      <TextInput
        hideSearchBtn
        hideCrossBtn
        inputType="textarea"
        placeholder="Add a description to this board"
        maxLength="250"
        classList="text-input px-1"
        name="board-description"
        inputValue={boardDescription}
        onChange={onChange}
      />

      <span className="d-block w-100 text-center">Activity</span>
      <div className="activity-list-container">
        {board.activities.map(activity => <li key={activity._id}>{activity.message}</li>)}
      </div>

      <div style={{ position: 'relative', height: '30px' }}>
        {
          status.loading
            ? <Loader.FormLoader style={{ transform: 'scale(0.7)' }} />
            : <button style={{ display: 'block', margin: '0 auto' }} type="button" onClick={loadActivities}>Load more activities</button>
        }
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  board: state.board,
});

BoardMenu.propTypes = {

};


export default connect(mapStateToProps)(BoardMenu);
