/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';


const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};


// eslint-disable-next-line object-curly-newline
const CreateBoardForm = ({ handleSubmit, handleChange, title, description }) => {
  return (
    <form className="new-board" action="/board" onSubmit={handleSubmit}>

      <input onChange={handleChange} className="w-100 px-2" type="text" name="title" id="title" placeholder="Add a title of the board" value={title} required />

      <div className="container">

        <div className="row">
          <textarea onChange={handleChange} className="w-100 mt-4 px-2" name="description" id="description" placeholder="Description..." value={description} />
        </div>

        <div className="row justify-content-center">
          <div className="col-4">
            <input onChange={handleChange} type="radio" name="access" value="private" id="private" hidden defaultChecked />
            <label className="access-label text-center" htmlFor="private">Private</label>
          </div>
          <div className="col-4">
            <input onChange={handleChange} type="radio" name="access" value="public" id="public" hidden />
            <label className="access-label text-center" htmlFor="public">Public</label>
          </div>
        </div>

        <div className="row mt-4 justify-content-center">
          <button type="submit" className="col-12 btn btn-primary">Create</button>
        </div>
      </div>

    </form>
  );
};


CreateBoardForm.propTypes = propTypes;


export default CreateBoardForm;
