import React, { Component } from "react";
import { connect } from "react-redux";
import "../../styles/homeHeader.scss";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { processLogout } from "../../store/actions";

class HomeHeader extends Component {
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
    const { activeTab, isLoggedIn, userInfo } = this.props;

    const defaultAvatar = "https://via.placeholder.com/40?text=User";
    const userAvatarSrc =
      isLoggedIn && userInfo && userInfo.avatar
        ? userInfo.avatar
        : defaultAvatar;

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
                  <i className="fas fa-angle-down"></i>
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
                  <i className="fas fa-angle-down"></i>
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
              {!isLoggedIn ? (
                <button onClick={this.handleGoLogin}>
                  Đăng nhập / Đăng ký
                </button>
              ) : (
                <div className="user-logged-in">
                  <div className="user-info">
                    <img
                      src={userAvatarSrc}
                      alt="User Avatar"
                      className="user-mini-avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultAvatar;
                      }}
                    />
                    <div className="user-info-text">
                      <div className="user-name">
                        {userInfo?.first_name + " " + userInfo?.last_name ||
                          userInfo?.email ||
                          "Người dùng"}
                      </div>
                      <div className="user-role">
                        <i className="fas fa-user-tie"></i>
                        {(() => {
                          const roleId = userInfo?.role_id;
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
                      {userInfo?.role_id === 1 && (
                        <a href="/admin" className="dropdown-item">
                          <i className="fas fa-cogs"></i> Trang quản lý
                        </a>
                      )}
                      {userInfo?.role_id === 2 && (
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
