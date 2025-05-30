import React, { Component } from "react";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import { withRouter } from "react-router-dom";
import "../styles/payment.scss";
import { createVnpayPayment } from "../services/userService";

class PaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderInfo: null,
      loading: true,
      error: null,
      allServicesMap: {},
      vnpayError: null,
      paymentStatusMessage: null,
      returnInvoiceId: null,
      returnResultCode: null,
      isProcessingPayment: false,
    };
  }

  componentDidMount() {
    this.processOrderInfo();
    this.processVnpayReturnParams();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.processVnpayReturnParams();
    }
  }

  processOrderInfo = () => {
    if (this.props.location.state && this.props.location.state.booking_id) {
      const servicesArray = this.props.location.state.services || [];
      const servicesMap = servicesArray.reduce((acc, service) => {
        acc[service.service_id] = service;
        return acc;
      }, {});

      this.setState({
        orderInfo: this.props.location.state,
        loading: false,
        allServicesMap: servicesMap,
      });
    } else {
      this.setState({
        error: "Không tìm thấy thông tin đơn hàng để thanh toán.",
        loading: false,
      });
    }
  };

  processVnpayReturnParams = () => {
    const queryParams = new URLSearchParams(this.props.location.search);
    const vnp_txn_ref = queryParams.get("vnp_txn_ref");
    const paymentStatus = queryParams.get("paymentStatus");
    const resultCode = queryParams.get("resultCode");

    if (vnp_txn_ref && paymentStatus) {
      this.setState({
        returnInvoiceId: vnp_txn_ref.split("_")[0],
        returnResultCode: resultCode,
        paymentStatusMessage: this.getPaymentStatusMessage(paymentStatus),
      });
      this.props.history.replace({ search: "" });
    }
  };

  getPaymentStatusMessage = (status) => {
    switch (status) {
      case "success":
        return "Thanh toán thành công!";
      case "failed":
        return "Thanh toán thất bại. Vui lòng thử lại.";
      case "pending_confirmation":
        return "Giao dịch đang chờ xác nhận. Vui lòng kiểm tra lại sau ít phút.";
      default:
        return "Trạng thái thanh toán không xác định.";
    }
  };

  formatServices = (servicesObject) => {
    const { allServicesMap } = this.state;
    if (!servicesObject || Object.keys(servicesObject).length === 0) {
      return "Không có";
    }

    const serviceList = Object.entries(servicesObject)
      .filter(([, quantity]) => quantity > 0)
      .map(([serviceId, quantity]) => {
        const service = allServicesMap[serviceId];

        if (service && service.name) {
          return `${service.name} (x${quantity})`;
        } else {
          return `Dịch vụ không xác định (ID: ${serviceId}) (x${quantity})`;
        }
      });
    return serviceList.join(", ");
  };

  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  handleVnpayPayment = async () => {
    const { orderInfo } = this.state;
    if (!orderInfo || !orderInfo.booking_id || !orderInfo.final_total_price) {
      this.setState({
        vnpayError: "Không có thông tin đơn hàng hợp lệ để thanh toán.",
      });
      return;
    }

    this.setState({ isProcessingPayment: true, vnpayError: null });

    try {
      const invoiceId = orderInfo.booking_id;
      const amount = orderInfo.final_total_price;
      const orderDescription = `Thanh toan don hang #${invoiceId}`;

      const response = await createVnpayPayment(
        invoiceId,
        amount,
        orderDescription
      );

      if (response && response.errCode === 0 && response.payUrl) {
        window.location.href = response.payUrl;
      } else {
        this.setState({
          vnpayError:
            response.errMessage ||
            "Có lỗi xảy ra khi tạo URL thanh toán VNPAY.",
        });
      }
    } catch (error) {
      this.setState({ vnpayError: error.message || "Lỗi kết nối đến server." });
    } finally {
      this.setState({ isProcessingPayment: false });
    }
  };

  render() {
    this.scrollToTop();
    const {
      orderInfo,
      loading,
      error,
      vnpayError,
      paymentStatusMessage,
      returnInvoiceId,
      returnResultCode,
      isProcessingPayment,
    } = this.state;

    if (loading) {
      return (
        <React.Fragment>
          <HomeHeader />
          <div className="payment-page-container loading-state">
            <div className="spinner"></div>
            <p>Đang tải thông tin thanh toán...</p>
          </div>
          <HomeFooter />
        </React.Fragment>
      );
    }

    if (error) {
      return (
        <React.Fragment>
          <HomeHeader />
          <div className="payment-page-container error-state">
            <p className="error-message">{error}</p>
            <button
              className="btn-secondary"
              onClick={() => this.props.history.push("/field-booking")}
            >
              Trở về Trang Đặt Sân
            </button>
          </div>
          <HomeFooter />
        </React.Fragment>
      );
    }

    if (!orderInfo || !orderInfo.booking_id) {
      return (
        <React.Fragment>
          <HomeHeader />
          <div className="payment-page-container error-state">
            <p className="error-message">Không có thông tin đơn hàng hợp lệ.</p>
            <button
              className="btn-secondary"
              onClick={() => this.props.history.push("/field-booking")}
            >
              Trở về Trang Đặt Sân
            </button>
          </div>
          <HomeFooter />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <HomeHeader />
        <div className="payment-page-container">
          <h1 className="page-title">Trang Thanh Toán</h1>
          <div className="order-summary-box">
            <div className="summary-item">
              <i className="fas fa-receipt info-icon"></i>
              <p>
                Mã hóa đơn: <span>#{orderInfo.booking_id}</span>
              </p>
            </div>
            <div className="summary-item">
              <i className="fas fa-user info-icon"></i>
              <p>
                Khách hàng:{" "}
                <span>
                  {orderInfo.userInfo?.first_name +
                    " " +
                    orderInfo.userInfo?.last_name}
                </span>
              </p>
            </div>
            <div className="summary-item">
              <i className="fas fa-envelope info-icon"></i>
              <p>
                Email: <span>{orderInfo.userInfo?.email}</span>
              </p>
            </div>
          </div>
          <h3 className="section-title">Chi tiết các mục đã đặt:</h3>
          {orderInfo.booking_details &&
          Array.isArray(orderInfo.booking_details) &&
          orderInfo.booking_details.length > 0 ? (
            <ul className="booking-details-list">
              {orderInfo.booking_details.map((item, index) => {
                const bookingDate = item.bookingDate || orderInfo.bookingDate;
                const formattedDate = new Date(bookingDate).toLocaleDateString(
                  "vi-VN"
                );

                return (
                  <li key={index} className="booking-item">
                    <div className="item-row">
                      <i className="fas fa-futbol item-icon"></i>
                      <p>
                        Đội: <span>{item.teamName || orderInfo.teamName}</span>{" "}
                        – Sân: <span>{item.selectedField}</span>
                      </p>
                    </div>
                    <div className="item-row">
                      <i className="far fa-calendar-alt item-icon"></i>
                      <p>
                        Ngày: <span>{formattedDate}</span>
                      </p>
                    </div>
                    <div className="item-row">
                      <i className="far fa-clock item-icon"></i>
                      <p>
                        Thời gian:{" "}
                        <span>
                          {item.startTime} - {item.endTime}
                        </span>
                      </p>
                    </div>

                    {item.selectedServices &&
                      Object.keys(item.selectedServices).length > 0 && (
                        <div className="item-row">
                          <i className="fas fa-concierge-bell item-icon"></i>
                          <span className="services-text">
                            Dịch vụ đi kèm:{" "}
                            {this.formatServices(item.selectedServices)}
                          </span>
                        </div>
                      )}

                    <div className="item-total-price">
                      Tổng tiền:{" "}
                      <span>
                        {item.totalPrice?.toLocaleString("vi-VN") || "N/A"} VNĐ
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="no-details-message">
              Không có chi tiết đặt sân nào được tìm thấy.
            </p>
          )}
          <div className="grand-total-section">
            <p className="total-price-display">
              Tổng số tiền cần thanh toán:{" "}
              <span className="amount">
                {orderInfo.final_total_price
                  ? orderInfo.final_total_price.toLocaleString("vi-VN")
                  : "N/A"}{" "}
                VNĐ
              </span>
            </p>
          </div>

          {returnInvoiceId && (
            <div className="vnpay-return-section">
              <h3>Kết quả Thanh toán VNPAY:</h3>
              <p>
                Mã hóa đơn: <span>#{returnInvoiceId}</span>
              </p>
              <p>
                Trạng thái:{" "}
                <span
                  className={
                    paymentStatusMessage &&
                    paymentStatusMessage.includes("thành công")
                      ? "success-text"
                      : "error-text"
                  }
                >
                  {paymentStatusMessage}
                </span>
              </p>
              <p>
                Mã phản hồi VNPAY: <span>{returnResultCode}</span>
              </p>
            </div>
          )}

          {/* HIỂN THỊ LỖI KHI GỌI API VNPAY */}
          {vnpayError && <p className="error-message">{vnpayError}</p>}

          <div className="payment-actions">
            <button
              className="btn-primary btn-pay"
              onClick={this.handleVnpayPayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment
                ? "Đang xử lý..."
                : "Thanh toán ngay bằng VNPAY"}
            </button>
            <button
              className="btn-secondary btn-back"
              onClick={() => this.props.history.push("/field-booking")}
            >
              Trở về
            </button>
          </div>
          <div className="support-info">
            <p>
              Bạn có thắc mắc? Liên hệ hỗ trợ:{" "}
              <a href="sanbongminioldtrafford@gmail.com">
                sanbongminioldtrafford@gmail.com
              </a>
            </p>
            <p>
              Hoặc gọi: <span>0556 182 391</span>
            </p>
          </div>
        </div>
        <HomeFooter />
      </React.Fragment>
    );
  }
}

export default withRouter(PaymentPage);
