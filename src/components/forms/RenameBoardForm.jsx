/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import TextInput from '../utils/TextInput';

const RenameBoardForm = (props) => {
  const [state, setState] = useState({
    value: props.boardTitle,
  });

  const handleChange = (e) => {
    setState({ ...state, value: e.target.value });
    console.log(state);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(state);
  };

  const clearInput = () => {
    setState({ value: '' });
  };

  return (
    <form action="" onSubmit={handleSubmit} className="w-100">
      <span className="popup-title text-dark">Rename board</span>
      <div className="input-container">
        <label htmlFor="titlename">Title</label>
        <TextInput
          onCrossBtnClick={clearInput}
          onChange={handleChange}
          inputValue={state.value}
          classList="rename-board-input"
          name="titlename"
          id="titlename"
          placeholder="Enter new board name"
          hideSearchBtn
          focusedAfterCleared
          selectOnMounted
        />
      </div>
      <button type="submit" className="btn btn-success btn-block board-control-popup-btn">Rename</button>
    </form>
  );
};

export default RenameBoardForm;
