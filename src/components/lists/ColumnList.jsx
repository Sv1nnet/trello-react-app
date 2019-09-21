/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../utils/TextInput';
import hasParent from '../../utlis/hasParent';
import switchElements from '../../utlis/switchElements';
import boardActions from '../../actions/boardActions';
import Messages from '../utils/Messages';
import ColumnContainer from '../columns/ColumnContainer';
import { ColumnListContext } from '../context/ColumnListContext';
import '../../styles/columnList.sass';
import AddBoardContent from '../utils/AddBoardContent';


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
  });

  // We need use temp column refs array because every setColumnRefs returns a new array and
  // every next CardList will have previously passed empty columnRefs without new refs from the other
  // CardList components. So we push a new ref in tempColumnRefs and then destructure it in setColumnRefs
  const tempColumnRefs = [];

  // columnRefs - all column refs. We need them to add mouse enter event handlers when user drags column
  const [columnRefs, setColumnRefs] = useState([]);

  const { columnsState, switchColumnPositions } = useContext(ColumnListContext);

  const handleError = (err) => {
    setState({
      ...state,
      err: {
        message: err.message,
        statusCode: err.status,
      },
    });
  };

  const addColumn = (e, columnTitle) => {
    e.preventDefault();

    if (!columnTitle) {
      const err = { status: 400, message: 'Column title can not be blank' };
      handleError(err);
      return Promise.reject(err);
    }

    const { createColumn, token, board } = props;
    const column = {
      title: columnTitle,
      position: board.columns.length,
    };

    if (column.title) {
      return createColumn(token.token, board._id, column)
        .catch((err) => {
          handleError(err);
          return Promise.reject(err);
        });
    }
  };

  const switchColumns = (e, source) => {
    switchElements(e, source, columnRefs, switchColumnPositions);
  };

  const closeMessage = () => {
    setState({
      ...state,
      err: {
        message: '',
        statusCode: undefined,
      },
      addNewColumn: {
        active: false,
        columnTitle: '',
      },
    });
  };

  const { board } = props;

  const columnList = columnsState.sortedColumns.map((column, i) => {
    const columnCards = board.cards.filter(card => card.column === column._id);
    return (
      <ColumnContainer
        key={column._id}
        cards={columnCards}
        listTitle={column.title}
        columnId={column._id}
        columnRefs={columnRefs}
        tempColumnRefs={tempColumnRefs}
        setColumnRefs={setColumnRefs}
        handleError={handleError}
        switchColumns={switchColumns}
      />
    );
  });

  return (
    <>
      {state.err.message && <Messages.ErrorMessage message={state.err.message} closeMessage={closeMessage} />}
      <div className="board-lists-container d-flex align-items-start">
        {columnList}

        <div className="add-new-column-button-container">
          <AddBoardContent
            addContent={addColumn}
            openBtnTitle="Add another column"
            addBtnTitle="Add Column"
            containerClass="add-new-column-inputs-container"
            addBtnClass="add-column-btn"
            textInputOptions={{
              textInputName: 'columnTitle',
              textInputId: 'column-title',
              textInputClass: 'title-input',
              textInputPlaceholder: 'Column title...',
            }}
          />
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
