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
  const [updatePositionsState, setUpdatePositionsState] = useState({
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
  // const [columnRefs, setColumnRefs] = useState([]);
  // const [cardRefs, setCardRefs] = useState([]);

  const {
    columnContextAPI,
    cardsContextAPI,
  } = useContext(ColumnListContext);

  const {
    renderedCardsState,
    setRenderedCardsState,
    switchCardPositions,
    updateCardPositions,
  } = cardsContextAPI;

  const {
    columnsState,
    switchColumnPositions,
    updateColumnPositions,
  } = columnContextAPI;

  const handleError = (err) => {
    setUpdatePositionsState({
      ...updatePositionsState,
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

  // const switchColumns = (e, source) => {
  //   switchElements(e, source, columnRefs, switchColumnPositions);
  // };

  // const switchCards = (e, source) => {
  //   switchElements(e, source, cardRefs, switchCardPositions);
  // };

  const closeMessage = () => {
    setUpdatePositionsState({
      ...updatePositionsState,
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

  return (
    <>
      {updatePositionsState.err.message && <Messages.ErrorMessage message={updatePositionsState.err.message} closeMessage={closeMessage} />}
      <div className="board-lists-container d-flex align-items-start">
        {/* {columnList} */}
        {columnsState}

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

const mapStateToProps = updatePositionsState => ({
  token: updatePositionsState.user.token,
  board: updatePositionsState.board,
});

const mapDispatchToProps = dispatch => ({
  createColumn: (token, boardId, data) => dispatch(boardActions.createColumn(token, boardId, data)),
});


ColumnList.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(ColumnList);
// export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ColumnList));
