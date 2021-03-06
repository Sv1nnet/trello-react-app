// React/Redux components
import React from 'react';
import PropTypes from 'prop-types';

// Custom components
import AuthNav from '../navigation/auth/AuthNav';

// Styles
import '../../styles/homePage.sass';


const propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      confToken: PropTypes.string,
    }).isRequired,
  }).isRequired,
};


const HomePage = ({ location, history, match }) => {
  const routeInfo = {
    location,
    history,
    match,
  };

  return (
    <div className="home-page-wrapper">
      <div className="container home-page">
        <div className="row text-center">
          <div className="col-12">
            <h1 className="my-3">Welcome to <span className="d-inline-block">Trello-like</span></h1>
            <AuthNav routeInfo={routeInfo} />
          </div>
        </div>
      </div>
    </div>
  );
};


HomePage.propTypes = propTypes;


export default HomePage;
