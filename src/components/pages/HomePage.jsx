import React from 'react';
import '../../styles/homePage.sass';
import AuthNav from '../navigation/AuthNav';

const HomePage = (props) => {
  const { location, history, match } = props;
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

export default HomePage;
