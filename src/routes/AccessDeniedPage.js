import React from "react";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import { Link } from "react-router-dom";
import "../styles/AccessDeniedPage.scss";

const AccessDeniedPage = () => {
  return (
    <>
      <HomeHeader />
      <div className="access-denied-container">
        <div className="icon">
          <i className="fas fa-ban"></i>
        </div>
        <h1>Truy Cập Bị Từ Chối</h1>
        <p>Rất tiếc, bạn không có đủ quyền hạn để truy cập vào nội dung này.</p>
        <div className="actions">
          <Link
            to="/home"
            className="access-denied-action-btn access-denied-action-btn--primary"
          >
            Về Trang chủ
          </Link>
          {/*
          <Link
            to="/system/dashboard"
            className="access-denied-action-btn access-denied-action-btn--secondary"
          >
            Về Bảng điều khiển
          </Link>
          */}
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default AccessDeniedPage;
