import React, { Component } from "react";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import { withRouter } from "react-router-dom"; // Make sure to import withRouter

class PaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderInfo: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    // Retrieve order information from history.location.state
    if (this.props.location.state && this.props.location.state.orderInfo) {
      this.setState({
        orderInfo: this.props.location.state.orderInfo,
        loading: false,
      });
    } else {
      this.setState({
        error: "Không tìm thấy thông tin đơn hàng để thanh toán.",
        loading: false,
      });
      // Optionally redirect if no data is found, e.g., to the booking page
      // this.props.history.replace('/dat-san');
    }
  }

  render() {
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
            <button onClick={() => this.props.history.push("/dat-san")}>
              Quay lại trang đặt sân
            </button>
          </div>
          <HomeFooter />
        </React.Fragment>
      );
    }

    if (!orderInfo) {
      return (
        <React.Fragment>
          <HomeHeader />
          <div className="payment-page-container">
            <p>Không có thông tin đơn hàng.</p>
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
          <p>
            Tổng số tiền cần thanh toán:{" "}
            {orderInfo.final_total_price.toLocaleString("vi-VN")} VNĐ
          </p>

          <h3>Chi tiết các mục đã đặt:</h3>
          <ul>
            {orderInfo.booking_details &&
              orderInfo.booking_details.map((item, index) => (
                <li key={index}>
                  Đội: {item.teamName}, Sân: {item.selectedField}, Ngày:{" "}
                  {item.bookingDate}, Thời gian: {item.startTime} -{" "}
                  {item.endTime}, Tổng tiền:{" "}
                  {item.totalPrice.toLocaleString("vi-VN")} VNĐ
                  {Object.keys(item.selectedServices).length > 0 && (
                    <span> (Dịch vụ: {item.servicesFormatted})</span>
                  )}
                </li>
              ))}
          </ul>
          {/* Integrate payment methods here */}
          <button className="btn btn-success">Thanh toán ngay</button>
        </div>
        <HomeFooter />
      </React.Fragment>
    );
  }
}

export default withRouter(PaymentPage);
