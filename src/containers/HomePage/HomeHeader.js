import React, { Component } from "react";
import { connect } from "react-redux";
import "../../styles/homeHeader.scss";
import {
  Redirect,
  withRouter,
} from "react-router-dom/cjs/react-router-dom.min";
import { processLogout } from "../../store/actions";

class HomeHeader extends Component {
  HomeHeader = () => {};

  handleGoHome = () => {
    this.props.history.push("/home");
  };

  handleGoNews = () => {
    this.props.history.push("/field-news");
  };

  handleGoContact = () => {
    this.props.history.push("/contact");
  };

  handleGoLogin = () => {
    this.props.history.push("/login");
  };

  handleLogout = () => {
    this.props.processLogout();
    this.props.history.push("/login");
  };

  render() {
    const { activeTab, processLogout } = this.props;
    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <div className="header-logo"></div>
            </div>
            <div className="center-content">
              <div
                className={`child-content ${
                  activeTab === "home" ? "active" : ""
                }`}
                onClick={this.handleGoHome}
              >
                <i className="fas fa-home"></i> Trang chủ
              </div>
              <div
                className={`child-content child-dropdown ${
                  activeTab === "about" ? "active" : ""
                }`}
              >
                <div className="nav-link">
                  Giới thiệu
                  <i class="fas fa-angle-down"></i>
                </div>

                <div className="dropdown-menu">
                  <a href="/information">Thông tin chung</a>
                  <a href="/field-list">Danh sách sân</a>
                  <a href="/service">Dịch vụ</a>
                </div>
              </div>

              <div
                className={`child-content child-dropdown ${
                  activeTab === "book" ? "active" : ""
                }`}
              >
                <div className="nav-link">
                  Đặt sân
                  <i class="fas fa-angle-down"></i>
                </div>
                <div className="dropdown-menu">
                  <a href="/field-booking">Đăng ký sân</a>
                  <a href="/field-schedule">Lịch thuê sân</a>
                </div>
              </div>
              <div
                className={`child-content ${
                  activeTab === "field-news" ? "active" : ""
                }`}
                onClick={this.handleGoNews}
              >
                Tin tức
              </div>
              <div
                className={`child-content ${
                  activeTab === "contact" ? "active" : ""
                }`}
                onClick={this.handleGoContact}
              >
                Liên hệ
              </div>
            </div>
            <div className="right-content">
              {!this.props.isLoggedIn ? (
                <button onClick={this.handleGoLogin}>
                  Đăng nhập / Đăng ký
                </button>
              ) : (
                <div className="user-logged-in">
                  <div className="user-info">
                    <div className="user-mini-avatar"></div>
                    <div className="user-info-text">
                      <div className="user-name">
                        {this.props.userInfo?.first_name +
                          " " +
                          this.props.userInfo?.last_name ||
                          this.props.userInfo?.email ||
                          "Người dùng"}
                      </div>
                      <div className="user-role">
                        <i className="fas fa-user-tie"></i>
                        {(() => {
                          const roleId = this.props.userInfo?.role_id;
                          if (roleId === 1) return "Chủ sân";
                          if (roleId === 2) return "Nhân viên";
                          if (roleId === 3) return "Khách hàng";
                          return "Không rõ vai trò";
                        })()}
                      </div>
                    </div>
                    <div className="user-dropdown-menu">
                      <a href="/profile" className="dropdown-item">
                        <i className="fas fa-user"></i> Trang cá nhân
                      </a>
                      {this.props.userInfo?.role_id === 1 && (
                        <a href="/admin" className="dropdown-item">
                          <i className="fas fa-cogs"></i> Trang quản lý
                        </a>
                      )}
                      {this.props.userInfo?.role_id === 2 && (
                        <a href="/staff" className="dropdown-item">
                          <i className="fas fa-cogs"></i> Trang quản lý
                        </a>
                      )}
                    </div>
                  </div>
                  <div
                    className="btn btn-logout"
                    onClick={this.handleLogout}
                    title="Đăng xuất"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(processLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HomeHeader));
