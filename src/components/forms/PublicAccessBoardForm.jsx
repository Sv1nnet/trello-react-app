/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

const ReadonlyAccessBoardForm = (props) => {
  const [state, setState] = useState({
    isPrivate: props.isPrivate,
  });

  const handleChange = (e) => {
    setState({ ...state, isPrivate: e.target.value === 'private' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(state);
  };

  return (
    <form action="" onSubmit={handleSubmit} className="w-100">
      <span className="popup-title text-dark">Set board Private/Public</span>

      <div className="access-dropdown-inputs-container">
        <div className="access-input-container">
          <input onChange={handleChange} className="access-input" type="radio" name="access" value="private" id="private" hidden defaultChecked={state.isPrivate} />
          <label className="access-label text-center" htmlFor="private">Private</label>
          <span>Only board members can see this board.</span>
        </div>

        <div className="access-input-container">
          <input onChange={handleChange} className="access-input" type="radio" name="access" value="public" id="public" hidden defaultChecked={!state.isPrivate} />
          <label className="access-label text-center" htmlFor="public">Public</label>
          <span>All people can see this board.</span>
        </div>
      </div>

      <button type="submit" className="btn btn-success btn-block board-control-popup-btn">Apply</button>
    </form>
  );
};

export default ReadonlyAccessBoardForm;
