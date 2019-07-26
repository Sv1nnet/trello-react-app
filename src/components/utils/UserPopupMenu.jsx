import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/navbar.sass';

class UserPopupMenu extends Component {
  state = {
    showPopup: true,
    mounted: false,
  }

  // When component mounted we need watch if popup component was target of click event. If not we need popup to be closed
  componentDidMount() {
    if (window) {
      window.addEventListener('click', this.windowClick, false);
    }
  }

  // Remove watching click event
  componentWillUnmount() {
    window.removeEventListener('click', this.windowClick, false);
  }

  // If user clicked not this popup component we have to hide it
  windowClick = (event) => {
    const { removeElement } = this.props;
    const { mounted } = this.state;

    if (event.target.classList.contains('dropdown-user') || event.target.classList.contains('user-credentials')) {
      return;
    }

    if (mounted) removeElement();
    else this.setState(state => ({ ...state, mounted: true })); // We need this line because once user icon was clicked popup component also handles this click event and close himself. So we set mounted true after the very first lick event was invoked
  }

  render() {
    const { userData } = this.props;
    return (
      <div className="dropdown-menu dropdown-user active">
        <div className="container-fluid">

          <div className="row">
            <div className="col-12 dropdown-user-credentials pt-2 border-bottom">
              <p className="user-credentials text-center">{`${userData.email} (${userData.nickname})`}</p>
            </div>

            <div className="col-12 px-0 dropdown-user-credentials pt-2 pb-2 border-bottom">
              <Link className="text-center w-100 d-block" to="/user">Edit account</Link>
            </div>

            <div className="col-12 px-0 dropdown-user-credentials pt-2">
              <Link className="text-center w-100 d-block" to="/logout">Log out</Link>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default UserPopupMenu;
