import React, { Component } from "react";
import { Redirect, Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import "../styles/payment.scss";
import { createVnpayPayment } from "../services/userService";
import { path } from "../utils";

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
      isVnpayReturnContext: false,
      vnpayReturnParamsPresent: false,
      initialCheckDone: false,
    };
  }

  componentDidMount() {
    this.determineContextAndProcess();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.location.search !== prevProps.location.search &&
      this.state.isVnpayReturnContext
    ) {
      this.determineContextAndProcess();
    }
  }

  determineContextAndProcess = () => {
    const { match, location } = this.props;
    this.setState({ loading: true, initialCheckDone: false });

    if (match.path === path.VNPAY) {
      this.setState({ isVnpayReturnContext: true }, () => {
        const queryParams = new URLSearchParams(location.search);
        const vnp_txn_ref = queryParams.get("vnp_txn_ref");
        const paymentStatusParam = queryParams.get("paymentStatus");

        if (vnp_txn_ref && paymentStatusParam) {
          this.setState({ vnpayReturnParamsPresent: true });
          this.processVnpayReturnParams(queryParams);
        } else {
          this.setState({
            vnpayReturnParamsPresent: false,
            error: "Thông tin trả về từ VNPAY không hợp lệ.",
          });
        }
        this.setState({ loading: false, initialCheckDone: true });
      });
    } else if (match.path === path.PAYMENT) {
      this.setState({ isVnpayReturnContext: false }, () => {
        this.processOrderInfo();
        this.setState({ initialCheckDone: true });
      });
    } else {
      this.setState({
        loading: false,
        initialCheckDone: true,
        error: "Đường dẫn không hợp lệ.",
      });
    }
  };

  processOrderInfo = () => {
    if (this.props.location.state && this.props.location.state.booking_id) {
      const servicesArray = this.props.location.state.services || [];
      const servicesMap = servicesArray.reduce((acc, service) => {
        acc[service.service_id] = service;
        return acc;
      }, {});
      this.setState({
        orderInfo: this.props.location.state,
        allServicesMap: servicesMap,
        loading: false,
        error: null,
      });
    } else {
      this.setState({
        error: "Không tìm thấy thông tin đơn hàng để thanh toán.",
        loading: false,
        orderInfo: null,
      });
    }
  };

  processVnpayReturnParams = (queryParams) => {
    const vnp_txn_ref = queryParams.get("vnp_txn_ref");
    const paymentStatus = queryParams.get("paymentStatus");
    const resultCode = queryParams.get("resultCode");

    if (vnp_txn_ref && paymentStatus) {
      this.setState({
        returnInvoiceId: vnp_txn_ref ? vnp_txn_ref.split("_")[0] : null,
        returnResultCode: resultCode,
        paymentStatusMessage: this.getPaymentStatusMessage(paymentStatus),
      });
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
      const bookingIdForAPI = orderInfo.booking_id;
      const amountForAPI = orderInfo.final_total_price;
      const orderDescription = `Thanh toan don hang #${bookingIdForAPI}`;

      const response = await createVnpayPayment(
        bookingIdForAPI,
        amountForAPI,
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
      this.setState({
        vnpayError: error.message || "Lỗi kết nối đến server.",
      });
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
      isVnpayReturnContext,
      vnpayReturnParamsPresent,
      initialCheckDone,
    } = this.state;

    if (!initialCheckDone || loading) {
      return (
        <React.Fragment>
          <HomeHeader />
          <div className="payment-page-container loading-state">
            <div className="spinner"></div>
            <p>Đang xử lý dữ liệu...</p>
          </div>
          <HomeFooter />
        </React.Fragment>
      );
    }

    if (isVnpayReturnContext && !vnpayReturnParamsPresent) {
      return <Redirect to={path.HOMEPAGE} />;
    }

    if (!isVnpayReturnContext && error && !orderInfo) {
      return <Redirect to={path.FIELDBOOKING} />;
    }

    if (isVnpayReturnContext && vnpayReturnParamsPresent && returnInvoiceId) {
      return (
        <React.Fragment>
          <HomeHeader />
          <div className="payment-page-container vnpay-return-display">
            <h3>Kết quả Thanh toán VNPAY:</h3>
            <p>
              Mã đơn hàng tham chiếu: <span>#{returnInvoiceId}</span>
            </p>
            <p>
              Trạng thái:
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
              Mã kết quả: <span>{returnResultCode}</span>
            </p>
            <Link
              to={path.HOMEPAGE}
              className="access-denied-action-btn access-denied-action-btn--primary"
              style={{ marginTop: "20px" }}
            >
              Quay về trang chủ
            </Link>
            {paymentStatusMessage &&
              !paymentStatusMessage.includes("thành công") && (
                <Link
                  to={path.FIELDBOOKING}
                  className="access-denied-action-btn access-denied-action-btn--secondary"
                  style={{ marginTop: "20px", marginLeft: "10px" }}
                >
                  Thử đặt sân lại
                </Link>
              )}
          </div>
          <HomeFooter />
        </React.Fragment>
      );
    }

    if (!isVnpayReturnContext && orderInfo && orderInfo.booking_id) {
      return (
        <React.Fragment>
          <HomeHeader />
          <div className="payment-page-container">
            <h1 className="page-title">Trang Thanh Toán</h1>
            <div className="order-summary-box">
              <div className="summary-item">
                <i className="fas fa-receipt info-icon"></i>
                <p>
                  Mã đơn hàng: <span>#{orderInfo.booking_id}</span>
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
                  const formattedDate = new Date(
                    bookingDate
                  ).toLocaleDateString("vi-VN");
                  return (
                    <li key={index} className="booking-item">
                      <div className="item-row">
                        <i className="fas fa-futbol item-icon"></i>
                        <p>
                          Đội:{" "}
                          <span>{item.teamName || orderInfo.teamName}</span> –
                          Sân: <span>{item.selectedField}</span>
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
                          {item.totalPrice?.toLocaleString("vi-VN") || "N/A"}{" "}
                          VNĐ
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
            {vnpayError && <p className="error-message">{vnpayError}</p>}
            <div className="payment-actions">
              <button
                className="access-denied-action-btn access-denied-action-btn--primary"
                onClick={this.handleVnpayPayment}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment
                  ? "Đang xử lý..."
                  : "Thanh toán ngay bằng VNPAY"}
              </button>
              <button
                className="access-denied-action-btn access-denied-action-btn--secondary"
                onClick={() => this.props.history.push(path.FIELDBOOKING)}
              >
                Trở về
              </button>
            </div>
            <div className="support-info">
              <p>
                Bạn có thắc mắc? Liên hệ hỗ trợ:{" "}
                <a href="mailto:sanbongminioldtrafford@gmail.com">
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

    return (
      <React.Fragment>
        <HomeHeader />
        <div className="payment-page-container error-state">
          <p className="error-message">
            {error || "Đã có lỗi xảy ra hoặc không thể hiển thị trang."}
          </p>
          <Link
            className="access-denied-action-btn access-denied-action-btn--secondary"
            to={path.HOMEPAGE}
          >
            Quay về Trang chủ
          </Link>
        </div>
        <HomeFooter />
      </React.Fragment>
    );
  }
}

export default withRouter(connect(null, null)(PaymentPage));
