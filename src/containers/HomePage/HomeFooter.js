import React, { Component } from "react";
import { connect } from "react-redux";
import "../../styles/homeFooter.scss";

const HomeFooter = () => {
  return (
    <footer className="home-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h2 className="footer-logo">Old Trafford</h2>
          <p>
            Địa chỉ: LK37 đường Trịnh Văn Bô, Phường Xuân Phương, Quận Nam Từ
            Liêm, TP. Hà Nội
          </p>
          <p>Điện thoại: 0559 025 896</p>
          <p>Email: sanbongminioldtrafford@gmail.com</p>
        </div>

        <div className="footer-column">
          <h3>Liên kết nhanh</h3>
          <ul>
            <li>
              <a href="/gioi-thieu">Giới thiệu</a>
            </li>
            <li>
              <a href="/dat-san">Đặt sân</a>
            </li>
            <li>
              <a href="/tin-tuc">Tin tức</a>
            </li>
            <li>
              <a href="/lien-he">Liên hệ</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Hỗ trợ</h3>
          <ul>
            <li>
              <a href="/huong-dan">Hướng dẫn đặt sân</a>
            </li>
            <li>
              <a href="/chinh-sach">Quy định & Điều khoản</a>
            </li>
            <li>
              <a href="/chinh-sach">Câu hỏi thường gặp</a>
            </li>
            <li>
              <a href="/bao-mat">Chính sách bảo mật</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Theo dõi chúng tôi</h3>
          <div className="footer-social">
            <a
              href="https://www.facebook.com/profile.php?id=61576305751101"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-square"></i>
            </a>
            <a
              href="https://zalo.me/0333271602"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-comments"></i>
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Old Trafford. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default HomeFooter;
