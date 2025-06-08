import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import ProfileInfo from "../containers/System/ProfileInfo";
import BookingHistory from "../containers/System/BookingHistory";
import ChangePassword from "../containers/System/ChangePassword";
import "../styles/userProfile.scss";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeView: "info",
    };
  }

  setActiveView = (view) => {
    this.setState({ activeView: view });
  };

  render() {
    const { activeView } = this.state;

    return (
      <>
        <HomeHeader />
        <div className="user-profile-page-container">
          <div className="profile-layout">
            <div className="profile-sidebar">
              <div
                className={`sidebar-item ${
                  activeView === "info" ? "active" : ""
                }`}
                onClick={() => this.setActiveView("info")}
              >
                <i className="fas fa-user-circle"></i> Thông tin tài khoản
              </div>
              <div
                className={`sidebar-item ${
                  activeView === "history" ? "active" : ""
                }`}
                onClick={() => this.setActiveView("history")}
              >
                <i className="fas fa-history"></i> Lịch sử đặt sân
              </div>
              <div
                className={`sidebar-item ${
                  activeView === "change-password" ? "active" : ""
                }`}
                onClick={() => this.setActiveView("change-password")}
              >
                <i class="fas fa-key"></i> Đổi mật khẩu
              </div>
            </div>
            <div className="profile-content">
              {activeView === "info" && <ProfileInfo />}
              {activeView === "history" && <BookingHistory />}
              {activeView === "change-password" && <ChangePassword />}
            </div>
          </div>
        </div>
        <HomeFooter />
      </>
    );
  }
}

export default connect()(UserProfile);
