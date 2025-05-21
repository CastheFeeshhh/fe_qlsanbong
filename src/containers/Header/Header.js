import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions";
import "./Header.scss";

class Header extends Component {
  render() {
    const { processLogout } = this.props;

    return (
      <div className="header-container">
        <div className="header-content">
          <div className="left-content">
            <div className="header-logo"></div>
          </div>
          <div className="center-content"></div>
          <div className="right-content">
            <div className="owner-show">
              <div className="owner-name">Lê Danh Khải</div>
              <div className="owner-role">
                <i className="fas fa-user-tie"></i>
                <span>Chủ sân</span>
              </div>
            </div>
            <div
              className="btn btn-logout"
              onClick={processLogout}
              title="Đăng xuất"
            >
              <i className="fas fa-sign-out-alt"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
