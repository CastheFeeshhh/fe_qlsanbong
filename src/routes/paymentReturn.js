import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import "../styles/paymentReturn.scss";

class PaymentReturn extends Component {
  render() {
    return (
      <div className="payment-return-container">
        <div className="payment-success-box">
          <h1>Thanh toán thành công!</h1>
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
          <button
            className="home-button"
            onClick={() => (window.location.href = "/")}
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }
}

export default PaymentReturn;
