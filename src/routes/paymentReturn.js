import React, { Component } from "react";
import { Redirect, Link, withRouter } from "react-router-dom";
import { path } from "../utils";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import "../styles/paymentReturn.scss";

class PaymentReturn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isValidAccess: false,
      userMessage: "",
      messageType: "info",
      vnpayTxnRef: null,
      vnpayResponseCode: null,
    };
  }

  componentDidMount() {
    const queryParams = new URLSearchParams(this.props.location.search);
    const vnp_TxnRef = queryParams.get("vnp_TxnRef");
    const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");

    if (vnp_TxnRef && vnp_ResponseCode) {
      this.setState(
        {
          isValidAccess: true,
          vnpayTxnRef: vnp_TxnRef,
          vnpayResponseCode: vnp_ResponseCode,
          isLoading: false,
        },
        () => {
          this.generateUserMessage();
        }
      );
    } else {
      this.setState({
        isValidAccess: false,
        isLoading: false,
        userMessage:
          "Thông tin giao dịch không hợp lệ hoặc không được cung cấp.",
        messageType: "error",
      });
    }
  }

  generateUserMessage = () => {
    const { vnpayResponseCode, vnpayTxnRef } = this.state;

    if (vnpayResponseCode === "00") {
      this.setState({
        userMessage: `Thanh toán thành công cho đơn hàng ${vnpayTxnRef}! Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.`,
        messageType: "success",
      });
    } else {
      this.setState({
        userMessage: `Thanh toán không thành công cho đơn hàng ${vnpayTxnRef}. Mã phản hồi từ VNPAY: ${vnpayResponseCode}. Vui lòng thử lại hoặc liên hệ hỗ trợ.`,
        messageType: "error",
      });
    }
  };

  render() {
    const { isLoading, isValidAccess, userMessage, messageType } = this.state;

    if (isLoading) {
      return (
        <>
          <HomeHeader />
          <div className="payment-return-loading-container">
            Đang xử lý kết quả thanh toán...
          </div>
          <HomeFooter />
        </>
      );
    }

    if (!isValidAccess) {
      return <Redirect to={path.HOMEPAGE} />;
    }

    let title = "";
    let titleColor = "#333";
    let iconClass = "fas fa-info-circle";

    if (messageType === "success") {
      title = "Thanh toán thành công!";
      titleColor = "#28a745";
      iconClass = "fas fa-check-circle";
    } else if (messageType === "error") {
      title = "Thanh toán thất bại!";
      titleColor = "#dc3545";
      iconClass = "fas fa-times-circle";
    } else {
      title = "Thông báo giao dịch";
    }

    return (
      <>
        <HomeHeader />
        <div className="payment-return-page-container">
          <div className="payment-return-content-box">
            <div className="payment-return-icon">
              <i className={iconClass} style={{ color: titleColor }}></i>
            </div>
            <h1 className="payment-return-title" style={{ color: titleColor }}>
              {title}
            </h1>
            <p className="payment-return-message">{userMessage}</p>
            <div className="payment-return-actions">
              <Link
                to={path.HOMEPAGE}
                className="payment-return-btn payment-return-btn--primary"
              >
                Quay về trang chủ
              </Link>
              {messageType === "error" && (
                <Link
                  to={path.FIELDBOOKING}
                  className="payment-return-btn payment-return-btn--secondary"
                >
                  Thử đặt sân lại
                </Link>
              )}
            </div>
          </div>
        </div>
        <HomeFooter />
      </>
    );
  }
}

export default withRouter(PaymentReturn);
