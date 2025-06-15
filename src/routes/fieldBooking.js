import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import "../styles/fieldBooking.scss";
import { fetchAllServices, fetchAllFields } from "../store/actions/appActions";
import {
  calculateTotalPrice,
  validateBookingData,
  getBookingPriceDetails,
} from "../helpers/bookingCalculations";
import {
  sendBookingsToBackend,
  removeBookingItem,
  addBookingItem,
} from "../helpers/bookingActions";
import {
  formatSelectedServices,
  renderServiceSection,
} from "../helpers/serviceUtils";
import { renderBookingItemRow } from "../helpers/bookingRendering";
import * as appApiService from "../services/bookingService";
import CalendarModal from "../component/CalendarModal";
import { withRouter } from "react-router-dom";

import { validateCalendarSelection } from "../helpers/validationUtils";

class fieldBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBooking: {
        teamName: "",
        captainName: "",
        phoneNumber: "",
        bookingDate: moment().format("YYYY-MM-DD"),
        selectedField: "",
        startTimeHour: "18",
        startTimeMinute: "00",
        endTimeHour: "19",
        endTimeMinute: "00",
        selectedServices: {},
      },
      bookings: [],
      totalPrice: 0,
      finalTotalPrice: 0,
      errorMessage: "",
      formErrors: {},
      isFormValid: false,

      isCalendarModalOpen: false,
      fieldBookingsData: null,
      isLoadingCalendarData: false,
      calendarError: "",
      calendarButtonError: "",
      addBookingLoading: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleServiceQuantityChange =
      this.handleServiceQuantityChange.bind(this);
    this.handleServiceCheckboxChange =
      this.handleServiceCheckboxChange.bind(this);
    this.resetBookingForm = this.resetBookingForm.bind(this);
    this.handleRemoveBookingItemClick =
      this.handleRemoveBookingItemClick.bind(this);
    this.validateAndSetFormState = this.validateAndSetFormState.bind(this);
    this.handleOpenCalendarModal = this.handleOpenCalendarModal.bind(this);
    this.handleCloseCalendarModal = this.handleCloseCalendarModal.bind(this);
    this.handleAddBookingClick = this.handleAddBookingClick.bind(this);
    this.fetchFieldSchedules = this.fetchFieldSchedules.bind(this);
    this.getCalendarButtonError = this.getCalendarButtonError.bind(this);
    this.handleConfirmBookingClick = this.handleConfirmBookingClick.bind(this);

    this.scheduleFetchTimeout = null;
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(
      (prevState) => {
        const updatedCurrentBooking = {
          ...prevState.currentBooking,
          [name]: value,
        };

        const { updatedBooking, newTotalPrice } = getBookingPriceDetails(
          updatedCurrentBooking,
          this.props.fieldPrices,
          this.props.services
        );

        return {
          currentBooking: updatedBooking,
          totalPrice: newTotalPrice,
        };
      },
      () => {
        this.validateAndSetFormState();

        if (name === "bookingDate" || name === "selectedField") {
          if (this.scheduleFetchTimeout) {
            clearTimeout(this.scheduleFetchTimeout);
          }
          this.scheduleFetchTimeout = setTimeout(() => {
            this.fetchFieldSchedules();
          }, 500);
        }
      }
    );
  };

  handleTimeChange = (event) => {
    const { name, value } = event.target;
    this.setState(
      (prevState) => {
        const updatedCurrentBooking = {
          ...prevState.currentBooking,
          [name]: value,
        };

        const { updatedBooking, newTotalPrice } = getBookingPriceDetails(
          updatedCurrentBooking,
          this.props.fieldPrices,
          this.props.services
        );

        return {
          currentBooking: updatedBooking,
          totalPrice: newTotalPrice,
        };
      },
      () => {
        this.validateAndSetFormState();
      }
    );
  };

  handleServiceQuantityChange = (event) => {
    const serviceId = event.target.name;
    const quantity = parseInt(event.target.value, 10);
    this.setState((prevState) => {
      const updatedSelectedServices = {
        ...prevState.currentBooking.selectedServices,
      };
      if (quantity > 0) {
        updatedSelectedServices[serviceId] = quantity;
      } else {
        delete updatedSelectedServices[serviceId];
      }

      const updatedCurrentBooking = {
        ...prevState.currentBooking,
        selectedServices: updatedSelectedServices,
      };

      const { updatedBooking, newTotalPrice } = getBookingPriceDetails(
        updatedCurrentBooking,
        this.props.fieldPrices,
        this.props.services
      );

      return {
        currentBooking: updatedBooking,
        totalPrice: newTotalPrice,
      };
    }, this.validateAndSetFormState);
  };

  handleServiceCheckboxChange = (event) => {
    const serviceId = event.target.value;
    const isChecked = event.target.checked;
    this.setState((prevState) => {
      const updatedSelectedServices = {
        ...prevState.currentBooking.selectedServices,
      };
      if (isChecked) {
        updatedSelectedServices[serviceId] =
          updatedSelectedServices[serviceId] || 1;
      } else {
        delete updatedSelectedServices[serviceId];
      }

      const updatedCurrentBooking = {
        ...prevState.currentBooking,
        selectedServices: updatedSelectedServices,
      };

      const { updatedBooking, newTotalPrice } = getBookingPriceDetails(
        updatedCurrentBooking,
        this.props.fieldPrices,
        this.props.services
      );

      return {
        currentBooking: updatedBooking,
        totalPrice: newTotalPrice,
      };
    }, this.validateAndSetFormState);
  };

  resetBookingForm = () => {
    this.setState(
      {
        bookings: [],
        currentBooking: {
          teamName: "",
          captainName: "",
          phoneNumber: "",
          bookingDate: moment().format("YYYY-MM-DD"),
          selectedField: "",
          startTimeHour: "18",
          startTimeMinute: "00",
          endTimeHour: "19",
          endTimeMinute: "00",
          selectedServices: {},
        },
        totalPrice: 0,
        finalTotalPrice: 0,
        errorMessage: "",
        formErrors: {},
        isFormValid: false,
        fieldBookingsData: null,
        calendarError: "",
        calendarButtonError: "",
      },
      () => {
        if (
          this.state.currentBooking.bookingDate &&
          this.state.currentBooking.selectedField
        ) {
          this.fetchFieldSchedules();
        }
      }
    );
  };

  handleRemoveBookingItemClick = (index) => {
    const { updatedBookings, priceChange } = removeBookingItem(
      this.state.bookings,
      index,
      this.props.fieldPrices,
      this.props.services
    );
    this.setState((prevState) => ({
      bookings: updatedBookings,
      finalTotalPrice: prevState.finalTotalPrice + priceChange,
    }));
  };

  validateAndSetFormState = () => {
    const { currentBooking } = this.state;
    const { services } = this.props;
    const validationResult = validateBookingData(currentBooking, services);

    this.setState({
      formErrors: validationResult.errors,
      errorMessage: validationResult.errorMessage,
      isFormValid: validationResult.isValid,
    });

    return validationResult;
  };

  getCalendarButtonError = () => {
    const { currentBooking } = this.state;
    const { bookingDate, selectedField } = currentBooking;
    const { fieldPrices } = this.props;

    return validateCalendarSelection(bookingDate, selectedField, fieldPrices);
  };

  fetchFieldSchedules = async () => {
    const { currentBooking } = this.state;
    const { bookingDate, selectedField } = currentBooking;
    const { fieldPrices } = this.props;

    const validationError = this.getCalendarButtonError();

    if (validationError) {
      this.setState({
        calendarButtonError: validationError,
        isLoadingCalendarData: false,
        calendarError: "",
        fieldBookingsData: null,
      });
      return;
    }

    this.setState({
      calendarButtonError: "",
      isLoadingCalendarData: true,
      calendarError: "",
      fieldBookingsData: null,
    });

    try {
      const response = await appApiService.getSchedules({
        field_id: Number(selectedField),
        date: bookingDate,
      });

      const backendBookings = response.schedules;
      console.log("Lịch từ DB:", backendBookings);

      const START_HOUR = 6;
      const END_HOUR = 22;
      const MINUTES_STEP = 30;

      let hoursInDay = [];
      for (let h = START_HOUR; h < END_HOUR; h++) {
        for (let m = 0; m < 60; m += MINUTES_STEP) {
          const hourString = String(h).padStart(2, "0");
          const minuteString = String(m).padStart(2, "0");
          hoursInDay.push({
            hour: `${hourString}:${minuteString}`,
            status: "available",
            team: "",
            bookingDetailId: null,
          });
        }
      }

      backendBookings.forEach((booking) => {
        const bookingStartTime = moment(booking.start_time, "HH:mm:ss");
        const bookingEndTime = moment(booking.end_time, "HH:mm:ss");

        hoursInDay = hoursInDay.map((slot) => {
          const slotMoment = moment(slot.hour, "HH:mm");
          const nextSlotMoment = moment(slot.hour, "HH:mm").add(
            MINUTES_STEP,
            "minutes"
          );

          const isOverlapping =
            bookingStartTime.isBefore(nextSlotMoment) &&
            bookingEndTime.isAfter(slotMoment);

          if (isOverlapping) {
            return {
              ...slot,
              status: "booked",
              team: booking.team_name,
              bookingDetailId: booking.booking_detail_id,
            };
          }
          return slot;
        });
      });

      this.setState({
        fieldBookingsData: {
          fieldId: selectedField,
          date: bookingDate,
          slots: hoursInDay,
          minutesStep: MINUTES_STEP,
        },
        isLoadingCalendarData: false,
        calendarError: "",
      });
    } catch (error) {
      console.error("Lỗi khi tải lịch đặt sân:", error);
      let errorMessage = "Không thể tải lịch đặt sân. Vui lòng thử lại sau.";
      if (error.response) {
        errorMessage =
          error.response.data.errMessage ||
          error.response.data.message ||
          "Có lỗi xảy ra từ máy chủ.";
      } else if (error.request) {
        errorMessage =
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
      }
      this.setState({
        calendarError: errorMessage,
        isLoadingCalendarData: false,
        fieldBookingsData: null,
      });
    }
  };

  handleOpenCalendarModal = async () => {
    if (this.scheduleFetchTimeout) {
      clearTimeout(this.scheduleFetchTimeout);
      this.scheduleFetchTimeout = null;
    }
    await this.fetchFieldSchedules();
    if (!this.state.calendarError && this.state.fieldBookingsData) {
      this.setState({ isCalendarModalOpen: true });
    }
  };

  handleCloseCalendarModal = () => {
    this.setState({
      isCalendarModalOpen: false,
    });
  };

  handleAddBookingClick = async () => {
    this.setState({ addBookingLoading: true });

    const validationResult = this.validateAndSetFormState();
    if (!validationResult.isValid) {
      this.setState({ addBookingLoading: false });
      return;
    }

    const { currentBooking, bookings, fieldBookingsData } = this.state;
    const { fieldPrices, services } = this.props;

    if (
      !fieldBookingsData ||
      fieldBookingsData.date !== currentBooking.bookingDate ||
      String(fieldBookingsData.fieldId) !== String(currentBooking.selectedField)
    ) {
      if (this.scheduleFetchTimeout) {
        clearTimeout(this.scheduleFetchTimeout);
        this.scheduleFetchTimeout = null;
      }
      await this.fetchFieldSchedules();

      if (this.state.calendarError || !this.state.fieldBookingsData) {
        alert(
          this.state.calendarError ||
            "Không thể tải lịch sân để kiểm tra trùng lặp. Vui lòng thử lại."
        );
        this.setState({ addBookingLoading: false });
        return;
      }
    }

    const result = addBookingItem(
      currentBooking,
      bookings,
      fieldPrices,
      services,
      this.state.fieldBookingsData
    );

    if (result) {
      const { updatedBookings, priceOfAddedBooking, newCurrentBookingState } =
        result;
      this.setState(
        (prevState) => ({
          bookings: updatedBookings,
          currentBooking: newCurrentBookingState,
          totalPrice: 0,
          finalTotalPrice: prevState.finalTotalPrice + priceOfAddedBooking,
          errorMessage: "",
          formErrors: {},
          addBookingLoading: false,
        }),
        () => {
          this.validateAndSetFormState();
          alert("Đã thêm hóa đơn đặt sân!");
        }
      );
    } else {
      this.setState({ addBookingLoading: false });
    }
  };

  handleConfirmBookingClick = async () => {
    const { bookings, finalTotalPrice } = this.state;
    const { userInfo } = this.props;
    console.log("userInfo ở fieldBooking:", userInfo);
    const history = this.props.history;

    if (!history) {
      console.error("Lỗi: history object không có sẵn.");
      alert(
        "Đã xảy ra lỗi hệ thống, vui lòng thử lại sau. (Lỗi: Không tìm thấy đối tượng điều hướng)"
      );
      return;
    }

    try {
      const response = await sendBookingsToBackend(
        userInfo.user_id,
        bookings,
        finalTotalPrice
      );

      if (response.success) {
        this.resetBookingForm();
        alert(response.message);

        console.log("Dữ liệu chuẩn bị gửi đến trang /payment:", {
          userInfo: userInfo,
          booking_id: response.booking_id,
          final_total_price: response.final_total_price,
          booking_details: response.booking_details,
          services: this.props.services,
        });

        history.push({
          pathname: "/payment",
          state: {
            userInfo: userInfo,
            booking_id: response.booking_id,
            final_total_price: response.final_total_price,
            booking_details: response.booking_details,
            services: this.props.services,
          },
        });
      } else {
        console.error("Đặt sân thất bại:", response.message);
      }
    } catch (error) {
      console.error("Lỗi khi xác nhận đặt sân từ UI:", error);
      alert("Đã xảy ra lỗi không mong muốn khi xử lý đặt sân.");
    }
  };

  // handleClick = async () => {
  //   alert("check");
  //   console.log("test:", this.props.userInfo);
  //   let test_1 = this.props.userInfo;
  //   this.setState({
  //     currentBooking: {
  //       teamName: "ABC",
  //       captainName: test_1.first_name + " " + test_1.last_name,
  //       phoneNumber: test_1.phone,
  //       bookingDate: moment().format("YYYY-MM-DD"),
  //       selectedField: "",
  //       startTimeHour: "17",
  //       startTimeMinute: "00",
  //       endTimeHour: "18",
  //       endTimeMinute: "30",
  //       selectedServices: {},
  //     },
  //   });
  // };

  async componentDidMount() {
    await this.props.fetchAllServices();
    await this.props.fetchAllFields();
    console.log("FieldBooking mounted");
    console.log("check isLoggedIn:", this.props.isLoggedIn);

    this.validateAndSetFormState();

    if (
      this.state.currentBooking.bookingDate &&
      this.state.currentBooking.selectedField
    ) {
      this.fetchFieldSchedules();
    }
  }

  componentWillUnmount() {
    if (this.scheduleFetchTimeout) {
      clearTimeout(this.scheduleFetchTimeout);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const newCalendarButtonError = this.getCalendarButtonError();
    if (newCalendarButtonError !== prevState.calendarButtonError) {
      this.setState({ calendarButtonError: newCalendarButtonError });
    }
  }

  render() {
    const { isLoggedIn } = this.props;
    console.log("check isLoggedIn ở fieldBooking.js:", isLoggedIn);

    if (!isLoggedIn) {
      alert("đăng nhập để sử dụng tính năng");
      return <Redirect to="/login" />;
    }
    const {
      currentBooking,
      bookings,
      totalPrice,
      finalTotalPrice,
      errorMessage,
      isFormValid,
      isCalendarModalOpen,
      isLoadingCalendarData,
      calendarError,
      fieldBookingsData,
      addBookingLoading,
    } = this.state;
    const { fieldPrices, isLoadingFields, services, isLoadingServices } =
      this.props;

    if (isLoadingFields || isLoadingServices) {
      return <p>Đang tải dữ liệu cần thiết...</p>;
    }
    if (
      !fieldPrices ||
      fieldPrices.length === 0 ||
      !services ||
      services.length === 0
    ) {
      return (
        <p>
          Không thể tải dữ liệu sân hoặc dịch vụ. Vui lòng kiểm tra kết nối hoặc
          thử lại sau.
        </p>
      );
    }

    return (
      <React.Fragment>
        <HomeHeader activeTab="book" />
        <div className="booking-wrapper">
          <div className="booking-container">
            <div className="booking-form">
              <div className="form-header">
                <p>Bạn muốn đặt sân, vui lòng điền thông tin dưới đây!</p>
              </div>

              <div className="form-row">
                <div className="form-group-book">
                  <label htmlFor="teamName">Tên đội bóng (bắt buộc):</label>
                  <input
                    type="text"
                    id="teamName"
                    name="teamName"
                    value={currentBooking.teamName}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                {/* <div>
                  <button
                    type="button"
                    className="btn-test"
                    onClick={this.handleClick}
                  />
                </div> */}
                <div className="form-group-book">
                  <label htmlFor="captainName">Họ tên đội trưởng:</label>
                  <input
                    type="text"
                    id="captainName"
                    name="captainName"
                    value={currentBooking.captainName}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <div className="form-group-book">
                  <label htmlFor="phoneNumber">Số điện thoại liên hệ:</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={currentBooking.phoneNumber}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row align-items-center">
                <div className="form-group-book">
                  <label htmlFor="bookingDate">Chọn ngày:</label>
                  <input
                    type="date"
                    id="bookingDate"
                    name="bookingDate"
                    value={currentBooking.bookingDate}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <div className="form-group-book">
                  <label htmlFor="selectedField">Chọn sân:</label>
                  <select
                    id="selectedField"
                    name="selectedField"
                    value={currentBooking.selectedField}
                    onChange={this.handleInputChange}
                    required
                  >
                    <option value="">-- Vui lòng chọn sân --</option>
                    {isLoadingFields ? (
                      <option value="" disabled>
                        Đang tải thông tin sân...
                      </option>
                    ) : fieldPrices.length > 0 ? (
                      fieldPrices.map((field) => (
                        <option key={field.field_id} value={field.field_id}>
                          {field.field_name} - {field.price_per_minute * 60} VNĐ
                          / giờ
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Không có thông tin sân.
                      </option>
                    )}
                  </select>
                </div>
                <div className="form-group-book">
                  <label htmlFor="viewCalendar" className="invisible">
                    Xem lịch
                  </label>
                  <div className="btn-err-wrap">
                    <button
                      type="button"
                      id="viewCalendar"
                      className="icon-button"
                      onClick={this.handleOpenCalendarModal}
                      disabled={
                        isLoadingCalendarData ||
                        !currentBooking.bookingDate ||
                        !currentBooking.selectedField
                      }
                    >
                      {isLoadingCalendarData ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="far fa-calendar-alt"></i>
                      )}
                    </button>
                    {this.state.calendarButtonError && (
                      <div className="btn-err-msg">
                        {this.state.calendarButtonError}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row time-controls align-items-center">
                <div className="form-group-book time-select">
                  <label>Thời gian từ:</label>
                  <select
                    name="startTimeHour"
                    value={currentBooking.startTimeHour}
                    onChange={this.handleTimeChange}
                    required
                  >
                    {Array.from({ length: 17 }, (_, i) => i + 6).map((hour) => (
                      <option key={hour} value={String(hour).padStart(2, "0")}>
                        {String(hour).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span>giờ</span>
                  <select
                    name="startTimeMinute"
                    value={currentBooking.startTimeMinute}
                    onChange={this.handleTimeChange}
                    required
                  >
                    <option value="00">00</option>
                    <option value="30">30</option>
                  </select>
                  <span>phút</span>
                </div>
                <div className="form-group-book time-select">
                  <label>đến:</label>
                  <select
                    name="endTimeHour"
                    value={currentBooking.endTimeHour}
                    onChange={this.handleTimeChange}
                    required
                  >
                    {Array.from({ length: 17 }, (_, i) => i + 6).map((hour) => (
                      <option key={hour} value={String(hour).padStart(2, "0")}>
                        {String(hour).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span>giờ</span>
                  <select
                    name="endTimeMinute"
                    value={currentBooking.endTimeMinute}
                    onChange={this.handleTimeChange}
                    required
                  >
                    <option value="00">00</option>
                    <option value="30">30</option>
                  </select>
                  <span>phút</span>
                  <span>(Giá sân sau 16h00 sẽ tăng gấp đôi)</span>
                </div>
              </div>

              <div className="form-group services-group">
                <label>Chọn dịch vụ:</label>
                {renderServiceSection(
                  -1,
                  "Dịch vụ thuê",
                  "Thuê",
                  services,
                  isLoadingServices,
                  currentBooking.selectedServices,
                  this.handleServiceCheckboxChange,
                  this.handleServiceQuantityChange
                )}
                {renderServiceSection(
                  -1,
                  "Dịch vụ mua",
                  "Mua",
                  services,
                  isLoadingServices,
                  currentBooking.selectedServices,
                  this.handleServiceCheckboxChange,
                  this.handleServiceQuantityChange
                )}
              </div>

              <div className="form-group-book">
                <p>
                  Tổng tiền dự kiến cho hóa đơn mới:{" "}
                  {totalPrice.toLocaleString("vi-VN")} VNĐ
                </p>
                <div className="add-booking-action-row">
                  <button
                    type="button"
                    className="add-booking-btn"
                    onClick={this.handleAddBookingClick}
                    disabled={
                      !isFormValid || addBookingLoading || isLoadingCalendarData
                    }
                  >
                    {addBookingLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      "Thêm lịch đặt sân"
                    )}
                  </button>
                  {errorMessage && (
                    <div className="booking-error-message">{errorMessage}</div>
                  )}
                </div>
              </div>

              {bookings.length > 0 && (
                <div className="bookings-list">
                  <h3>Các hóa đơn đã thêm:</h3>
                  <div className="booking-table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Tên đội</th>
                          <th>Đội trưởng</th>
                          <th>SĐT</th>
                          <th>Ngày đặt</th>
                          <th>Sân</th>
                          <th>Thời gian</th>
                          <th>Dịch vụ thuê</th>
                          <th>Dịch vụ mua</th>
                          <th>Tổng</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.bookings.map((booking, index) =>
                          renderBookingItemRow(
                            booking,
                            index,
                            this.props.services,
                            this.props.fieldPrices,
                            this.handleRemoveBookingItemClick
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {bookings.length > 0 && (
                <div className="final-total-price">
                  <span className="final-total-label">Tổng tiền :</span>
                  <span className="final-total-amount">
                    {finalTotalPrice.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              )}

              <div className="booking-actions">
                <button
                  type="button"
                  className="confirm-button"
                  onClick={this.handleConfirmBookingClick}
                  disabled={bookings.length === 0}
                >
                  Xác nhận đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
        <HomeFooter />

        <CalendarModal
          isOpen={isCalendarModalOpen}
          onClose={this.handleCloseCalendarModal}
          isLoading={isLoadingCalendarData}
          apiError={calendarError}
          data={fieldBookingsData}
          selectedDate={currentBooking.bookingDate}
          selectedField={currentBooking.selectedField}
          fieldPrices={fieldPrices}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    services: state.app.services,
    fieldPrices: state.app.fieldPrices,
    isLoadingServices: state.app.isLoadingServices,
    isLoadingFields: state.app.isLoadingFields,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllServices: () => dispatch(fetchAllServices()),
    fetchAllFields: () => dispatch(fetchAllFields()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(fieldBooking)
);
