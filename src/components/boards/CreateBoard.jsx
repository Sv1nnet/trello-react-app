/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../styles/createBoard.sass';

const CreateBoard = (props) => {
  const [state, setState] = useState({ boardTitle: '' });
  const { close } = props;

  const handleChange = (e) => {
    setState({ ...state, boardTitle: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('submited', state);
  };

  return (
    <>
      <div className="fixed-top create-board-container mt-5 text-center">
        <div className="container-fluid pt-3 pb-3 bg-white position-relative">
          <div className="row no-gutters justify-content-center">

            <div className="create-board-close-btn-container">
              <div className="icon-container active">
                <FontAwesomeIcon onClick={close} className="close-button" icon={faTimes} />
              </div>
            </div>

            <div className="col-12 col-sm-12 text-center">
              <h5>Create a new board</h5>
            </div>

            <div className="col-12 col-sm-12">
              <form className="new-board" action="/board" onSubmit={handleSubmit}>
                <input onChange={handleChange} className="w-100 px-2" type="text" name="title" id="title" placeholder="Add a title of the board" value={state.boardTitle} />

                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-4">
                      <input type="radio" name="accessType" value="private" id="private" hidden defaultChecked />
                      <label className="access-label text-center" htmlFor="private">Private</label>
                    </div>
                    <div className="col-4">
                      <input type="radio" name="accessType" value="public" id="public" hidden />
                      <label className="access-label text-center" htmlFor="public">Public</label>
                    </div>
                  </div>

                  <div className="row mt-4 justify-content-center">
                    <button type="submit" className="col-12 btn btn-primary">Create</button>
                  </div>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
      <div onClick={close} className="modal-bg" />
    </>
  );
};

export default CreateBoard;
