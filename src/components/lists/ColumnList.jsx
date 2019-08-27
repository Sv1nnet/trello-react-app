import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../utils/TextInput';
import hasParent from '../../utlis/hasParent';
import boardActions from '../../actions/boardActions';
import Messages from '../utils/Messages';


const propTypes = {
  token: PropTypes.shape({
    access: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    members: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    cards: PropTypes.array.isRequired,
  }).isRequired,
  createColumn: PropTypes.func.isRequired,
};


const ColumnList = (props) => {
  const [state, setState] = useState({
    err: {
      message: '',
      statusCode: undefined,
    },
    addNewColumn: {
      active: false,
      columnTitle: '',
    },
  });
  const addColumnContainer = useRef(null);

  const { lists } = props;

  const handleChange = (e) => {
    const { target } = e;
    setState({
      ...state,
      addNewColumn: {
        active: true,
        columnTitle: target.value,
      },
    });
  };

  const closeAddColumnInput = (e, shouldClose) => {
    if (e) e.preventDefault();

    if (shouldClose || !hasParent(addColumnContainer.current, e.target)) {
      window.removeEventListener('click', closeAddColumnInput);

      setState({
        ...state,
        addNewColumn: {
          active: false,
          columnTitle: '',
        },
      });
    }
  };

  const openAddColumnInput = (e) => {
    e.preventDefault();

    setState({
      ...state,
      addNewColumn: {
        active: true,
        columnTitle: '',
      },
    });

    window.addEventListener('click', closeAddColumnInput);
  };

  const handleError = (err) => {
    setState({
      ...state,
      err: {
        message: err.message,
        statusCode: err.status,
      },
    });
  };

  const clearInput = () => {
    setState({
      ...state,
      addNewColumn: {
        active: true,
        columnTitle: '',
      },
    });
  };

  const addColumn = (e) => {
    e.preventDefault();

    const { createColumn, token, board } = props;
    const column = {
      title: state.addNewColumn.columnTitle,
      position: board.columns.length,
    };

    createColumn(token.token, board._id, column)
      .then((res) => {
        setState({
          ...state,
          addNewColumn: {
            active: false,
            columnTitle: '',
          },
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  const closeMessage = () => {
    setState({
      ...state,
      err: {
        message: '',
        statusCode: undefined,
      },
    });
  };

  return (
    <>
      {state.err.message && <Messages.ErrorMessage message={state.err.message} closeMessage={closeMessage} />}
      <div className="board-lists-container d-flex align-items-start">
        {lists}

        <div className="add-new-column-button-container" ref={addColumnContainer}>
          {state.addNewColumn.active
            ? (
              <div className="add-new-column-inputs-container">
                <TextInput
                  type="text"
                  name="coulmnTitle"
                  id="column-title"
                  classList="w-100 title-input"
                  onChange={handleChange}
                  onCrossBtnClick={clearInput}
                  inputValue={state.addNewColumn.columnTitle}
                  focuseAfterCleared
                  hideSearchBtn
                />

                <button onClick={addColumn} type="button">Add List</button>
              </div>
            )
            : (
              <a onClick={openAddColumnInput} href="/" className="btn btn-sm btn-block">
                <span>
                  <FontAwesomeIcon className="add-icon" icon={faPlus} /> Add another list
                </span>
              </a>
            )}

        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  createColumn: (token, boardId, data) => dispatch(boardActions.createColumn(token, boardId, data)),
});


ColumnList.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(ColumnList);
