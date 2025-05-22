import React, { Component } from "react";
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

class fieldBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBooking: {
        teamName: "",
        captainName: "",
        phoneNumber: "",
        bookingDate: "",
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
    this.handleDatePickerChange = this.handleDatePickerChange.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => {
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
    }, this.validateAndSetFormState);
  };

  handleTimeChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => {
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
    }, this.validateAndSetFormState);
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
    this.setState({
      bookings: [],
      currentBooking: {
        teamName: "",
        captainName: "",
        phoneNumber: "",
        bookingDate: "",
        selectedField: "",
        startTimeHour: "18",
        startTimeMinute: "00",
        endTimeHour: "19",
        endTimeMinute: "00",
        selectedServices: {},
      },
      totalPrice: 0,
      finalTotalPrice: 0,
    });
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

  validateCalendarInput = (bookingDate, selectedField, fieldPrices) => {
    let error = "";

    if (!bookingDate) {
      error = "Vui lòng chọn ngày đặt sân.";
    } else if (!selectedField) {
      error = "Vui lòng chọn sân.";
    } else {
      try {
        const selectedDateObj = moment(bookingDate, "YYYY-MM-DD");
        const today = moment().startOf("day");
        const threeMonthsLater = moment().add(3, "months").endOf("day");

        if (!selectedDateObj.isValid()) {
          error = "Ngày đặt sân không hợp lệ.";
        } else if (selectedDateObj.isBefore(today)) {
          error = "Không thể xem lịch cho ngày trong quá khứ.";
        } else if (selectedDateObj.isAfter(threeMonthsLater)) {
          error = "Chỉ có thể xem lịch trong vòng 3 tháng tới.";
        }
      } catch (e) {
        error = "Định dạng ngày đặt sân không đúng.";
      }

      if (!error && fieldPrices) {
        const fieldExists = fieldPrices.some(
          (field) => String(field.field_id) === String(selectedField)
        );
        if (!fieldExists) {
          error = "Sân được chọn không tồn tại hoặc đã bị xóa.";
        }
      } else if (!fieldPrices) {
        error = "Không có thông tin giá sân. Vui lòng thử lại.";
      }
    }
    return error;
  };

  handleDatePickerChange = (date) => {
    this.setState((prevState) => ({
      currentBooking: {
        ...prevState.currentBooking,
        bookingDate: date,
      },
    }));
  };

  handleFieldChange = (event) => {
    this.setState((prevState) => ({
      currentBooking: {
        ...prevState.currentBooking,
        selectedField: event.target.value,
      },
    }));
  };

  handleOpenCalendarModal = async () => {
    const { currentBooking } = this.state;
    const { bookingDate, selectedField } = currentBooking;
    const { fieldPrices } = this.props;

    const calendarSpecificError = this.validateCalendarInput(
      bookingDate,
      selectedField,
      fieldPrices
    );

    if (calendarSpecificError) {
      this.setState({
        calendarButtonError: calendarSpecificError,
        isCalendarModalOpen: false,
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
      isCalendarModalOpen: true,
    });

    try {
      const response = await appApiService.getSchedules({
        field_id: Number(selectedField),
        date: bookingDate,
      });

      const backendBookings = response.schedules;

      const START_HOUR = 6;
      const END_HOUR = 22;
      const MINUTES_STEP = 30;

      let hoursInDay = [];
      for (let h = START_HOUR; h < END_HOUR; h++) {
        for (let m = 0; m < 60; m += MINUTES_STEP) {
          const hourString = `${h < 10 ? "0" : ""}${h}`;
          const minuteString = `${m < 10 ? "0" : ""}${m}`;
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

      console.log("Dữ liệu hoursInDay đã xử lý:", hoursInDay);

      this.setState({
        fieldBookingsData: {
          fieldId: selectedField,
          date: bookingDate,
          slots: hoursInDay,
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

  handleCloseCalendarModal = () => {
    this.setState({
      isCalendarModalOpen: false,
      fieldBookingsData: null,
      calendarError: "",
      isLoadingCalendarData: false,
    });
  };

  async componentDidMount() {
    if (this.props.services.length === 0) {
      await this.props.fetchAllServices();
    }

    if (this.props.fieldPrices.length === 0) {
      await this.props.fetchAllFields();
    }

    this.validateAndSetFormState();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentBooking.bookingDate !==
        this.state.currentBooking.bookingDate ||
      prevState.currentBooking.selectedField !==
        this.state.currentBooking.selectedField ||
      prevProps.fieldPrices !== this.props.fieldPrices
    ) {
      const newCalendarButtonError = this.validateCalendarInput(
        this.state.currentBooking.bookingDate,
        this.state.currentBooking.selectedField,
        this.props.fieldPrices
      );

      if (newCalendarButtonError !== this.state.calendarButtonError) {
        this.setState({ calendarButtonError: newCalendarButtonError });
      }
    }
  }

  render() {
    const {
      currentBooking,
      bookings,
      totalPrice,
      finalTotalPrice,
      formErrors,
      errorMessage,
      isFormValid,
      isCalendarModalOpen,
      isLoadingCalendarData,
      calendarError,
      fieldBookingsData,
    } = this.state;
    const { fieldPrices, isLoadingFields, services, isLoadingServices } =
      this.props;

    if (!fieldPrices || !services) {
      return <p>Đang tải dữ liệu cần thiết...</p>;
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
                    {" "}
                    <button
                      type="button"
                      id="viewCalendar"
                      className="icon-button"
                      onClick={this.handleOpenCalendarModal}
                    >
                      <i className="far fa-calendar-alt"></i>{" "}
                    </button>
                    {this.state.calendarButtonError && (
                      <div className="btn-err-msg">
                        {" "}
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
                      <option
                        key={hour}
                        value={hour < 10 ? `0${hour}` : `${hour}`}
                      >
                        {hour < 10 ? `0${hour}` : `${hour}`}
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
                      <option
                        key={hour}
                        value={hour < 10 ? `0${hour}` : `${hour}`}
                      >
                        {hour < 10 ? `0${hour}` : `${hour}`}
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
                )}{" "}
                {renderServiceSection(
                  -1,
                  "Dịch vụ mua",
                  "Mua",
                  services,
                  isLoadingServices,
                  currentBooking.selectedServices,
                  this.handleServiceCheckboxChange,
                  this.handleServiceQuantityChange
                )}{" "}
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
                    disabled={!isFormValid}
                    onClick={() => {
                      const validationResult = this.validateAndSetFormState();

                      if (!validationResult.isValid) {
                        const firstErrorField = Object.keys(
                          validationResult.errors
                        )[0];
                        return;
                      }

                      const result = addBookingItem(
                        this.state.currentBooking,
                        this.state.bookings,
                        this.props.fieldPrices,
                        this.props.services
                      );

                      if (result) {
                        const {
                          updatedBookings,
                          priceOfAddedBooking,
                          newCurrentBookingState,
                        } = result;
                        this.setState(
                          (prevState) => ({
                            bookings: updatedBookings,
                            currentBooking: newCurrentBookingState,
                            totalPrice: 0,
                            finalTotalPrice:
                              prevState.finalTotalPrice + priceOfAddedBooking,
                            errorMessage: "",
                            formErrors: {},
                          }),
                          this.validateAndSetFormState
                        );
                        alert("Đã thêm hóa đơn đặt sân!");
                      }
                    }}
                  >
                    Thêm lịch đặt sân
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
                  onClick={() =>
                    sendBookingsToBackend(
                      this.state.bookings,
                      this.props.fieldPrices,
                      this.props.services,
                      this.resetBookingForm
                    )
                  }
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllServices: () => dispatch(fetchAllServices()),
    fetchAllFields: () => dispatch(fetchAllFields()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(fieldBooking);
