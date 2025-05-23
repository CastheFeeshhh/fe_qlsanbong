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
          <div className="payment-page-container">
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
          <div className="payment-page-container">
            <p className="error-message">{error}</p>
            <button onClick={() => this.props.history.push("/field-booking")}>
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
          <div className="payment-page-container">
            <p>Không có thông tin đơn hàng hợp lệ.</p>
            <button onClick={() => this.props.history.push("/field-booking")}>
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
          <h1>Trang Thanh Toán</h1>
          <p>Mã hóa đơn: {orderInfo.booking_id}</p>
          <p className="total-price-display">
            Tổng số tiền cần thanh toán:{" "}
            {orderInfo.final_total_price
              ? orderInfo.final_total_price.toLocaleString("vi-VN")
              : "N/A"}{" "}
            VNĐ
          </p>

          <h3>Chi tiết các mục đã đặt:</h3>
          {orderInfo.booking_details &&
          Array.isArray(orderInfo.booking_details) &&
          orderInfo.booking_details.length > 0 ? (
            <ul>
              {orderInfo.booking_details.map((item, index) => (
                <li key={index}>
                  <p>
                    Đội: <span>{item.teamName || orderInfo.teamName}</span> -
                    Sân: <span>{item.selectedField}</span>, Ngày:{" "}
                    <span>{item.bookingDate || orderInfo.bookingDate}</span> -
                    Thời gian:{" "}
                    <span>
                      {item.startTime} - {item.endTime}
                    </span>{" "}
                    - Tổng tiền:{" "}
                    <span>
                      {item.totalPrice
                        ? item.totalPrice.toLocaleString("vi-VN")
                        : "N/A"}{" "}
                      VNĐ
                    </span>
                    <p>
                      {item.selectedServices &&
                        Object.keys(item.selectedServices).length > 0 && (
                          <span>
                            {" "}
                            (Dịch vụ đi kèm:{" "}
                            {this.formatServices(item.selectedServices)})
                          </span>
                        )}
                    </p>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có chi tiết đặt sân nào được tìm thấy.</p>
          )}

          <div className="payment-actions">
            <button className="btn-success">Thanh toán ngay</button>
            <button onClick={() => this.props.history.push("/field-booking")}>
              Trở về
            </button>
          </div>
        </div>
        <HomeFooter />
      </React.Fragment>
    );
  }
}

export default withRouter(PaymentPage);
