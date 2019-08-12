/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

const ReadonlyAccessBoardForm = (props) => {
  const [state, setState] = useState({
    isReadonly: props.isReadonly,
  });

  const handleChange = (e) => {
    setState({ ...state, isReadonly: e.target.value === 'readonly' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(state);
  };

  return (
    <form action="" onSubmit={handleSubmit} className="w-100">
      <span className="popup-title text-dark">Set board Editable/Read-only</span>

      <div className="access-dropdown-inputs-container">
        <div className="access-input-container">
          <input onChange={handleChange} className="access-input" type="radio" name="readonly" value="readonly" id="readonly" hidden defaultChecked={state.isReadonly} />
          <label className="access-label text-center" htmlFor="readonly">Readonly</label>
          <span>Board members can not edit this board.</span>
        </div>

        <div className="access-input-container">
          <input onChange={handleChange} className="access-input" type="radio" name="readonly" value="editable" id="editable" hidden defaultChecked={!state.isReadonly} />
          <label className="access-label text-center" htmlFor="editable">Editable</label>
          <span>Board members can edit this board.</span>
        </div>
      </div>

      <button type="submit" className="btn btn-success btn-block board-control-popup-btn">Apply</button>
    </form>
  );
};

export default ReadonlyAccessBoardForm;
