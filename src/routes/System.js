import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/UserManage";
import Header from "../containers/Header/Header";
import "../styles/system.scss";

class System extends Component {
  render() {
    const { systemMenuPath, isLoggedIn } = this.props;
    if (!isLoggedIn) {
      return <Redirect to="/login" />;
    }

    return (
      <React.Fragment>
        <Header />
        <div className="system-layout">
          <aside className="system-sidebar">
            <ul>
              <li>
                <a href="/system/user-manage">Quản lý người dùng</a>
              </li>
              {/* Thêm các mục nav khác nếu có */}
            </ul>
          </aside>
          <main className="system-main-content">
            <Switch>
              <Route path="/system/user-manage" component={UserManage} />
              <Route
                component={() => {
                  return <Redirect to={systemMenuPath} />;
                }}
              />
            </Switch>
          </main>
        </div>
        <footer className="system-footer">Bản quyền &copy; 2025</footer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
