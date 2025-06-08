import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { getBookingHistory } from "../../services/userService";
import "../../styles/bookingHistory.scss";
import moment from "moment";

class BookingHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      isLoading: true,
      error: null,
      expandedBookingId: null,
    };
  }

  async componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.user_id) {
      await this.loadBookingHistory(this.props.userInfo.user_id);
    } else {
      this.setState({
        isLoading: false,
        error: "Không tìm thấy thông tin người dùng.",
      });
    }
  }

  loadBookingHistory = async (userId) => {
    this.setState({ isLoading: true, error: null });
    try {
      let response = await getBookingHistory(userId);
      if (response && response.errCode === 0) {
        this.setState({
          bookings: response.bookings || [],
          isLoading: false,
        });
      } else {
        throw new Error(
          response?.errMessage || "Không thể tải lịch sử đặt sân."
        );
      }
    } catch (e) {
      this.setState({
        error: "Có lỗi xảy ra khi tải dữ liệu.",
        isLoading: false,
      });
      toast.error("Có lỗi xảy ra khi tải dữ liệu!");
    }
  };

  handleToggleDetails = (bookingId) => {
    this.setState((prevState) => ({
      expandedBookingId:
        prevState.expandedBookingId === bookingId ? null : bookingId,
    }));
  };

  renderServices = (serviceBookings) => {
    if (!serviceBookings || serviceBookings.length === 0) {
      return <li>Không có dịch vụ đi kèm</li>;
    }

    let allServiceDetails = [];
    serviceBookings.forEach((sb) => {
      if (sb.ServiceBookingDetails) {
        allServiceDetails.push(...sb.ServiceBookingDetails);
      }
    });

    if (allServiceDetails.length === 0) {
      return <li>Không có dịch vụ đi kèm</li>;
    }

    return allServiceDetails.map((detail, index) => (
      <li key={index}>
        {detail.Service?.name} (SL: {detail.quantity})
      </li>
    ));
  };

  render() {
    const { bookings, isLoading, error, expandedBookingId } = this.state;

    if (isLoading) {
      return (
        <div className="booking-history-container loading-state">
          <div className="loading-spinner"></div>
          <p>Đang tải lịch sử đặt sân...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="booking-history-container error-state">
          <p>{error}</p>
        </div>
      );
    }

    return (
      <div className="booking-history-container">
        <div className="booking-list">
          {bookings && bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                className={`booking-card ${
                  expandedBookingId === booking.booking_id ? "expanded" : ""
                }`}
                key={booking.booking_id}
              >
                <div
                  className="booking-card-header"
                  onClick={() => this.handleToggleDetails(booking.booking_id)}
                >
                  <div className="booking-info-summary">
                    <span className="booking-id">
                      Mã đơn đặt: #{booking.booking_id}
                    </span>
                    <span className="booking-date">
                      Ngày tạo:{" "}
                      {moment(booking.created_at).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  <div className="booking-status-toggle">
                    <div
                      className={`booking-status status-${booking.status
                        .replace(/\s/g, "-")
                        .toLowerCase()}`}
                    >
                      {booking.status}
                    </div>
                    <i
                      className={`fas ${
                        expandedBookingId === booking.booking_id
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                    ></i>
                  </div>
                </div>
                {expandedBookingId === booking.booking_id && (
                  <div className="booking-card-details">
                    <p>
                      <strong>Ngày tạo đơn đầy đủ:</strong>{" "}
                      {moment(booking.created_at).format("HH:mm DD/MM/YYYY")}
                    </p>
                    <p>
                      <strong>Tổng tiền:</strong>{" "}
                      {parseFloat(booking.price_estimate).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VNĐ
                    </p>
                    <hr />
                    {booking.FieldBookingDetail &&
                      booking.FieldBookingDetail.map((detail) => (
                        <div
                          className="booking-detail-section"
                          key={detail.booking_detail_id}
                        >
                          <h5>Chi tiết lượt đặt:</h5>
                          <p>
                            <strong>Sân:</strong> {detail.Field?.field_name} (
                            {detail.Field?.type})
                          </p>
                          <p>
                            <strong>Ngày đá:</strong>{" "}
                            {moment(detail.date).format("DD/MM/YYYY")}
                          </p>
                          <p>
                            <strong>Thời gian:</strong> {detail.start_time} -{" "}
                            {detail.end_time}
                          </p>
                          <h6>Dịch vụ đi kèm:</h6>
                          <ul className="service-list">
                            {this.renderServices(detail.ServiceBookings)}
                          </ul>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-bookings">Bạn chưa có lịch sử đặt sân nào.</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};

export default connect(mapStateToProps)(BookingHistory);
