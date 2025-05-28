import React, { Component } from "react";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import { withRouter } from "react-router-dom";
import "../styles/payment.scss";

class PaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderInfo: null,
      loading: true,
      error: null,
      allServicesMap: {},
    };
  }

  componentDidMount() {
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
  }

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

  render() {
    this.scrollToTop();
    const { orderInfo, loading, error } = this.state;

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
              <i class="fas fa-receipt info-icon"></i>
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
                      {" "}
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
          {/* Phần tổng tiền toàn bộ được chỉnh sửa */}
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
          <div className="payment-actions">
            <button className="btn-primary btn-pay">Thanh toán ngay</button>
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
