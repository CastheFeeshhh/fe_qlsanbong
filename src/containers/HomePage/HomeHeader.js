import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";

class HomeHeader extends Component {
  HomeHeader = () => {};

  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  render() {
    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <div className="header-logo"></div>
            </div>
            <div className="center-content">
              <div className="child-content" onClick={this.scrollToTop}>
                <i class="fas fa-home"></i>Trang chủ
              </div>
              <div className="child-content child-dropdown">
                <div className="nav-link">
                  Giới thiệu
                  <i class="fas fa-angle-down"></i>
                </div>

                <div className="dropdown-menu">
                  <a href="/gioi-thieu/tong-quan">Thông tin chung</a>
                  <a href="/gioi-thieu/danh-sach-san">Danh sách sân</a>
                  <a href="/gioi-thieu/ban-do">Bản đồ</a>
                  <a href="/gioi-thieu/lich-su">Lịch sử</a>
                </div>
              </div>

              <div className="child-content child-dropdown">
                <div className="nav-link">
                  Đặt sân
                  <i class="fas fa-angle-down"></i>
                </div>
                <div className="dropdown-menu">
                  <a href="/gioi-thieu/thue-san">Đăng ký sân</a>
                  <a href="/gioi-thieu/lich-dat">Lịch thuê sân</a>
                </div>
              </div>
              <div className="child-content">Tin tức</div>
              <div className="child-content">Liên hệ</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
