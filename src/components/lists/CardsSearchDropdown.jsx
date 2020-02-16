import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextInput from '../utils/TextInput';
import CardContainer from '../cards/CardContainer';


const propTypes = {
  searchBar: PropTypes.shape({
    current: PropTypes.oneOfType([
      PropTypes.oneOf([null]),
      PropTypes.instanceOf(Element),
    ]),
  }).isRequired,
  searchCardsInput: PropTypes.shape({
    current: PropTypes.oneOfType([
      PropTypes.oneOf([null]),
      PropTypes.shape({
        inputElement: PropTypes.shape({
          current: PropTypes.instanceOf(Element),
        }),
      }),
    ]),
  }).isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  clearInput: PropTypes.func.isRequired,
  onSearchInputBlur: PropTypes.func.isRequired,
  cards: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string.isRequired,
  })),
};

const defaultProps = {
  searchText: '',
  cards: [],
};


const CardsSearchDropdown = (props) => {
  const {
    searchBar,
    searchCardsInput,
    onSearchChange,
    searchText,
    clearInput,
    onSearchInputBlur,
    cards,
  } = props;

  const [searchResult, setSearchResult] = useState([]);
  // Request webworker from the server and initilize it
  const workerRef = useRef(new Worker('/utils/findCardWorker.js'));

  useEffect(() => {
    const worker = new Worker('/utils/findCardWorker.js');

    // Kill a previous worker in order to prevent it from invocation onmessage handler
    // after previous input onChange events
    workerRef.current.terminate();
    workerRef.current = worker;

    worker.onmessage = (workerEvent) => {
      setSearchResult(workerEvent.data);
    };
    worker.postMessage({ cards, query: searchText });
  }, [cards, searchText]);

  return (
    <div className="dropdown-menu dropdown-search" ref={searchBar}>
      <div className="container-fluid dropdown-search-wrap">

        <div className="row">
          <div className="col dropdown-search-container my-1">

            <TextInput
              ref={searchCardsInput}
              placeholder="Search"
              onChange={onSearchChange}
              inputValue={searchText}
              onCrossBtnClick={clearInput}
              onBlur={onSearchInputBlur}
            />

          </div>
        </div>

        <div className="row search-results-container">
          <div className="col-12">
            <h5 className="mt-3 text-secondary text-center">Cards</h5>
          </div>

          <ul className="col-12 search-results">
            {searchResult.map((card, i) => (
              <CardContainer
                key={card._id}
                index={i}
                cardData={{
                  id: card._id,
                  labels: card.labels,
                  title: card.title,
                }}
                columnId={card.column}
              />
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};


CardsSearchDropdown.propTypes = propTypes;
CardsSearchDropdown.defaultProps = defaultProps;


export default CardsSearchDropdown;
