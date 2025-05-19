import React, { Component } from "react";
import { connect } from "react-redux";
import "../../styles/homeHeader.scss";
import {
  Redirect,
  withRouter,
} from "react-router-dom/cjs/react-router-dom.min";

class HomeHeader extends Component {
  HomeHeader = () => {};

  handleGoHome = () => {
    this.props.history.push("/home");
  };

  handleGoNews = () => {
    this.props.history.push("/news");
  };

  handleGoContact = () => {
    this.props.history.push("/contact");
  };

  render() {
    const { activeTab } = this.props;
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
                  <a href="/field-map">Bản đồ</a>
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
                  activeTab === "news" ? "active" : ""
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
              <button>Đăng nhập / Đăng ký</button>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HomeHeader));
