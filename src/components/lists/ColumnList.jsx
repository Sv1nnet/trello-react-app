/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../utils/TextInput';
import hasParent from '../../utlis/hasParent';
import boardActions from '../../actions/boardActions';
import Messages from '../utils/Messages';
import CardsList from './CardsList';
import '../../styles/columnList.sass';


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
  // All column refs. We nned them to add mouse enter event handlers when user drag column
  const [columnRefs, setColumnRefs] = useState([]);

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

    if (column.title) {
      return createColumn(token.token, board._id, column)
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
    }

    handleError({ message: 'Title can not be blank', status: 400 });
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

  const { board } = props;
  const sortedColumns = board.columns.sort((columnOne, columnTwo) => {
    if (columnOne.position < columnTwo.position) return -1;
    if (columnOne.position > columnTwo.position) return 1;
    return 0;
  });

  const columnList = sortedColumns.map((column, i) => {
    const columnCards = board.cards.filter(card => card.column === column._id);
    return (
      <CardsList
        key={column._id}
        handleError={handleError}
        cards={columnCards}
        listTitle={column.title}
        columnId={column._id}
        columnRefs={columnRefs}
        setColumnRefs={setColumnRefs}
      />
    );
  });

  return (
    <>
      {state.err.message && <Messages.ErrorMessage message={state.err.message} closeMessage={closeMessage} />}
      <div className="board-lists-container d-flex align-items-start">
        {columnList}

        <div className="add-new-column-button-container" ref={addColumnContainer}>
          {state.addNewColumn.active
            ? (
              <div className="add-new-column-inputs-container">
                <TextInput
                  type="text"
                  name="coulmnTitle"
                  id="column-title"
                  classList="w-100 title-input"
                  placeholder="Column title..."
                  onChange={handleChange}
                  onCrossBtnClick={clearInput}
                  inputValue={state.addNewColumn.columnTitle}
                  focusAfterActivated
                  focusAfterCleared
                  hideSearchBtn
                />

                <div className="buttons-container">
                  <button onClick={addColumn} type="button" className="bg-success text-white add-column-btn">Add List</button>
                  <button onClick={(e) => { closeAddColumnInput(e, true); }} type="button" className="close-input-btn">
                    <FontAwesomeIcon className="add-icon" icon={faTimes} />
                  </button>
                </div>
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
