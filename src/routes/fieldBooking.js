import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import "../styles/fieldBooking.scss";
import { fetchAllServices, fetchAllFields } from "../store/actions/appActions";
import { createBookingService } from "../services/userService";

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
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => {
      const updatedCurrentBooking = {
        ...prevState.currentBooking,
        [name]: value,
      };

      const newTotalPrice = this.calculateTotalPrice(
        updatedCurrentBooking.selectedField,
        updatedCurrentBooking.startTimeHour,
        updatedCurrentBooking.startTimeMinute,
        updatedCurrentBooking.endTimeHour,
        updatedCurrentBooking.endTimeMinute,
        updatedCurrentBooking.selectedServices
      );

      return {
        currentBooking: updatedCurrentBooking,
        totalPrice: newTotalPrice,
      };
    });
  };

  handleTimeChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => {
      const updatedCurrentBooking = {
        ...prevState.currentBooking,
        [name]: value,
      };

      const newTotalPrice = this.calculateTotalPrice(
        updatedCurrentBooking.selectedField,
        updatedCurrentBooking.startTimeHour,
        updatedCurrentBooking.startTimeMinute,
        updatedCurrentBooking.endTimeHour,
        updatedCurrentBooking.endTimeMinute,
        updatedCurrentBooking.selectedServices
      );

      return {
        currentBooking: updatedCurrentBooking,
        totalPrice: newTotalPrice,
      };
    });
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

      const newTotalPrice = this.calculateTotalPrice(
        prevState.currentBooking.selectedField,
        prevState.currentBooking.startTimeHour,
        prevState.currentBooking.startTimeMinute,
        prevState.currentBooking.endTimeHour,
        prevState.currentBooking.endTimeMinute,
        updatedSelectedServices
      );

      return {
        currentBooking: {
          ...prevState.currentBooking,
          selectedServices: updatedSelectedServices,
        },
        totalPrice: newTotalPrice,
      };
    });
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

      const newTotalPrice = this.calculateTotalPrice(
        prevState.currentBooking.selectedField,
        prevState.currentBooking.startTimeHour,
        prevState.currentBooking.startTimeMinute,
        prevState.currentBooking.endTimeHour,
        prevState.currentBooking.endTimeMinute,
        updatedSelectedServices
      );

      return {
        currentBooking: {
          ...prevState.currentBooking,
          selectedServices: updatedSelectedServices,
        },
        totalPrice: newTotalPrice,
      };
    });
  };

  handleCheckAvailability = () => {
    const {
      currentBooking: {
        bookingDate,
        selectedField,
        startTimeHour,
        startTimeMinute,
        endTimeHour,
        endTimeMinute,
      },
    } = this.state;
    const startTime = `${startTimeHour}:${startTimeMinute}`;
    const endTime = `${endTimeHour}:${endTimeMinute}`;
    console.log(
      "Kiểm tra lịch đặt cho:",
      bookingDate,
      selectedField,
      startTime,
      endTime
    );
    // Sau này sẽ gọi API để kiểm tra lịch ở đây
  };

  validateCurrentBooking = () => {
    const {
      teamName,
      captainName,
      phoneNumber,
      bookingDate,
      selectedField,
      startTimeHour,
      startTimeMinute,
      endTimeHour,
      endTimeMinute,
    } = this.state.currentBooking;

    if (
      !teamName ||
      !captainName ||
      !phoneNumber ||
      !bookingDate ||
      !selectedField ||
      !startTimeHour ||
      !startTimeMinute ||
      !endTimeHour ||
      !endTimeMinute
    ) {
      return false;
    }
    return true;
  };

  handleAddBookingItem = () => {
    if (this.validateCurrentBooking()) {
      this.setState((prevState) => {
        const updatedBookings = [
          ...prevState.bookings,
          prevState.currentBooking,
        ];

        const priceOfAddedBooking = this.calculateTotalPrice(
          prevState.currentBooking.selectedField,
          prevState.currentBooking.startTimeHour,
          prevState.currentBooking.startTimeMinute,
          prevState.currentBooking.endTimeHour,
          prevState.currentBooking.endTimeMinute,
          prevState.currentBooking.selectedServices
        );

        return {
          bookings: updatedBookings,
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
          finalTotalPrice: prevState.finalTotalPrice + priceOfAddedBooking,
        };
      });
      alert("Đã thêm hóa đơn đặt sân!");
    } else {
      alert(
        "Vui lòng nhập đầy đủ thông tin đặt sân (Tên đội, Tên đội trưởng, SĐT, Ngày, Giờ, Sân)."
      );
    }
  };

  handleRemoveBookingItem = (index) => {
    this.setState((prevState) => {
      const updatedBookings = [...prevState.bookings];

      const bookingToRemove = updatedBookings[index];

      const priceOfRemovedBooking = this.calculateTotalPrice(
        bookingToRemove.selectedField,
        bookingToRemove.startTimeHour,
        bookingToRemove.startTimeMinute,
        bookingToRemove.endTimeHour,
        bookingToRemove.endTimeMinute,
        bookingToRemove.selectedServices
      );

      updatedBookings.splice(index, 1);

      return {
        bookings: updatedBookings,
        finalTotalPrice: prevState.finalTotalPrice - priceOfRemovedBooking,
      };
    });
  };

  handleSendBookingsToBackend = async () => {
    if (this.state.bookings.length === 0) {
      alert("Vui lòng thêm ít nhất một hóa đơn đặt sân để gửi.");
      return;
    }

    try {
      const { services, fieldPrices } = this.props;
      let allBookingsSuccessful = true;

      for (const bookingItem of this.state.bookings) {
        const fieldInfo = fieldPrices.find(
          (f) => f.field_id.toString() === bookingItem.selectedField
        );
        if (!fieldInfo) {
          console.error(
            `Không tìm thấy thông tin sân với ID: ${bookingItem.selectedField}`
          );
          alert(
            `Lỗi: Không tìm thấy thông tin sân ${bookingItem.selectedField}. Vui lòng chọn lại.`
          );
          allBookingsSuccessful = false;
          break;
        }

        const calculatedTotalPrice = this.calculateTotalPrice(
          bookingItem.selectedField,
          bookingItem.startTimeHour,
          bookingItem.startTimeMinute,
          bookingItem.endTimeHour,
          bookingItem.endTimeMinute,
          bookingItem.selectedServices
        );

        const payload = {
          team_name: bookingItem.teamName,
          captain_name: bookingItem.captainName,
          phone_number: bookingItem.phoneNumber,
          booking_date: bookingItem.bookingDate,
          field_id: parseInt(bookingItem.selectedField, 10),
          start_time: `${bookingItem.startTimeHour}:${bookingItem.startTimeMinute}`,
          end_time: `${bookingItem.endTimeHour}:${bookingItem.endTimeMinute}`,
          total_price: calculatedTotalPrice,
          services: Object.keys(bookingItem.selectedServices).map(
            (serviceId) => {
              const serviceInfo = services.find(
                (s) => s.service_id.toString() === serviceId
              );
              return {
                service_id: parseInt(serviceId, 10),
                quantity: bookingItem.selectedServices[serviceId],
                price_at_booking: serviceInfo
                  ? parseFloat(serviceInfo.price)
                  : 0,
              };
            }
          ),
        };
        console.log("Dữ liệu gửi đi cho booking:", payload);

        const res = await createBookingService(payload);

        if (res && res.errCode === 0) {
          console.log(
            "Đặt sân thành công cho đội",
            bookingItem.teamName,
            ":",
            res
          );
        } else {
          console.error(
            "Lỗi khi đặt sân cho đội",
            bookingItem.teamName,
            ":",
            res
          );
          alert(
            `Lỗi khi đặt sân cho đội ${bookingItem.teamName}: ${
              res.message || JSON.stringify(res)
            }`
          );
          allBookingsSuccessful = false;
          break;
        }
      }

      if (allBookingsSuccessful) {
        alert("Tất cả các yêu cầu đặt sân đã được gửi thành công!");
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
      } else {
        alert(
          "Có lỗi xảy ra, một số yêu cầu đặt sân không được gửi thành công."
        );
      }
    } catch (error) {
      console.error("Lỗi trong quá trình gửi yêu cầu đặt sân:", error);
      alert("Đã có lỗi xảy ra khi gửi yêu cầu đặt sân. Vui lòng thử lại.");
    }
  };

  calculateTotalPrice = (
    selectedFieldId,
    startTimeHour,
    startTimeMinute,
    endTimeHour,
    endTimeMinute,
    selectedServices
  ) => {
    const { fieldPrices, services } = this.props;

    let fieldPrice = 0;
    const fieldInfo = fieldPrices.find(
      (field) => field.field_id.toString() === selectedFieldId
    );

    if (fieldInfo) {
      const pricePerMinute = parseFloat(fieldInfo.price_per_minute);

      const startHourInt = parseInt(startTimeHour, 10);
      const startMinuteInt = parseInt(startTimeMinute, 10);
      const endHourInt = parseInt(endTimeHour, 10);
      const endMinuteInt = parseInt(endTimeMinute, 10);

      let startTotalMinutes = startHourInt * 60 + startMinuteInt;
      let endTotalMinutes = endHourInt * 60 + endMinuteInt;

      if (
        isNaN(startTotalMinutes) ||
        isNaN(endTotalMinutes) ||
        endTotalMinutes <= startTotalMinutes
      ) {
        fieldPrice = 0;
      } else {
        const sixteenOClockInMinutes = 16 * 60;
        const DOUBLE_PRICE_FACTOR = 2;

        let costNormalRate = 0;
        let costDoubleRate = 0;

        if (endTotalMinutes <= sixteenOClockInMinutes) {
          costNormalRate =
            (endTotalMinutes - startTotalMinutes) * pricePerMinute;
        } else if (startTotalMinutes >= sixteenOClockInMinutes) {
          costDoubleRate =
            (endTotalMinutes - startTotalMinutes) *
            pricePerMinute *
            DOUBLE_PRICE_FACTOR;
        } else {
          const minutesBefore16 = sixteenOClockInMinutes - startTotalMinutes;
          costNormalRate = minutesBefore16 * pricePerMinute;

          const minutesAfter16 = endTotalMinutes - sixteenOClockInMinutes;
          costDoubleRate =
            minutesAfter16 * pricePerMinute * DOUBLE_PRICE_FACTOR;
        }

        fieldPrice = costNormalRate + costDoubleRate;
      }
    }

    let servicesPrice = 0;
    if (selectedServices && typeof selectedServices === "object") {
      Object.keys(selectedServices).forEach((serviceId) => {
        const quantity = selectedServices[serviceId];
        const serviceInfo = services.find(
          (s) => s.service_id.toString() === serviceId
        );
        if (
          serviceInfo &&
          !isNaN(parseFloat(serviceInfo.price)) &&
          quantity > 0
        ) {
          servicesPrice += parseFloat(serviceInfo.price) * quantity;
        }
      });
    }

    const finalTotalPrice = fieldPrice + servicesPrice;
    return isNaN(finalTotalPrice) || finalTotalPrice < 0 ? 0 : finalTotalPrice;
  };

  async componentDidMount() {
    console.log("fieldBooking: componentDidMount được gọi.");
    if (this.props.services.length === 0) {
      console.log(
        "fieldBooking: Services chưa có trong Redux state, dispatching fetchAllServices."
      );
      this.props.fetchAllServices();
    } else {
      console.log("fieldBooking: Services đã có trong Redux state.");
    }

    if (this.props.fieldPrices.length === 0) {
      console.log(
        "fieldBooking: Field Prices chưa có trong Redux state, dispatching fetchAllFields."
      );
      this.props.fetchAllFields();
    } else {
      console.log("fieldBooking: Field Prices đã có trong Redux state.");
    }
  }

  renderServiceSection = (bookingIndex, title, type) => {
    const selectedServices =
      bookingIndex === -1
        ? this.state.currentBooking.selectedServices
        : this.state.bookings[bookingIndex]?.selectedServices || {};

    const { services, isLoadingServices } = this.props;

    const filteredServices = services.filter((service) => {
      return service.type === type;
    });

    return (
      <div className="services-section">
        <h3>{title}</h3>
        <div className="services-grid">
          {isLoadingServices ? (
            <p>Đang tải dịch vụ...</p>
          ) : filteredServices.length > 0 ? (
            filteredServices.map((service) => {
              if (service.name === undefined) {
                console.error(
                  `[R_SERV_SEC] LỖI: Thuộc tính 'name' của dịch vụ ID ${service.service_id} là UNDEFINED!`,
                  service
                );
              }
              const isChecked = selectedServices.hasOwnProperty(
                service.service_id
              );

              return (
                <div className="service-item-quantity" key={service.service_id}>
                  <label
                    htmlFor={`service-${bookingIndex}-${service.service_id}`}
                  >
                    <input
                      type="checkbox"
                      id={`service-${bookingIndex}-${service.service_id}`}
                      name="services"
                      value={service.service_id}
                      onChange={this.handleServiceCheckboxChange}
                      checked={isChecked}
                    />
                    {/* Sử dụng service.name, nếu undefined thì hiển thị fallback */}
                    {service.name || "Tên dịch vụ không xác định"} (
                    {parseFloat(service.price).toLocaleString("vi-VN")} VNĐ){" "}
                  </label>
                  {isChecked && (
                    <div className="quantity-input">
                      <label
                        htmlFor={`quantity-${bookingIndex}-${service.service_id}`}
                      >
                        Số lượng:
                      </label>
                      <input
                        type="number"
                        id={`quantity-${bookingIndex}-${service.service_id}`}
                        name={service.service_id}
                        value={selectedServices[service.service_id] || 0}
                        onChange={this.handleServiceQuantityChange}
                        min="0"
                      />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>Không có dịch vụ nào thuộc loại này.</p>
          )}
        </div>
      </div>
    );
  };

  renderBookingItem = (booking, index) => {
    const {
      teamName,
      captainName,
      phoneNumber,
      bookingDate,
      selectedField,
      startTimeHour,
      startTimeMinute,
      endTimeHour,
      endTimeMinute,
      selectedServices,
    } = booking;

    const startTime = `${startTimeHour}:${startTimeMinute}`;
    const endTime = `${endTimeHour}:${endTimeMinute}`;

    const { services, fieldPrices } = this.props;

    const fieldDisplayName =
      fieldPrices.find((f) => f.field_id.toString() === selectedField)
        ?.field_name || `Sân ${selectedField}`;

    const rentedServices = Object.keys(selectedServices)
      .filter((serviceId) => {
        const service = services.find(
          (s) => s.service_id.toString() === serviceId
        );
        const isServiceFound = !!service;
        const isRentedType = service?.type === "Thuê";
        return isServiceFound && isRentedType;
      })
      .map((serviceId) => {
        const service = services.find(
          (s) => s.service_id.toString() === serviceId
        );

        if (
          service &&
          service.name !== undefined &&
          selectedServices[serviceId] !== undefined
        ) {
          return `${service.name} (x${selectedServices[serviceId]})`;
        } else {
          console.warn(
            `[R_BOOK_ITEM] Map Thuê (${serviceId}): Dịch vụ không đầy đủ hoặc không tìm thấy tên. Service: ${!!service}, Service Name Exists: ${
              service?.name !== undefined
            }, Quantity Exists: ${
              selectedServices[serviceId] !== undefined
            }. Trả về chuỗi rỗng.`
          );
          return "";
        }
      })
      .filter(Boolean)
      .join(", ");

    const soldServices = Object.keys(selectedServices)
      .filter((serviceId) => {
        const service = services.find(
          (s) => s.service_id.toString() === serviceId
        );
        const isServiceFound = !!service;
        const isSoldType = service?.type === "Mua";

        return isServiceFound && isSoldType;
      })
      .map((serviceId) => {
        const service = services.find(
          (s) => s.service_id.toString() === serviceId
        );

        if (
          service &&
          service.name !== undefined &&
          selectedServices[serviceId] !== undefined
        ) {
          return `${service.name} (x${selectedServices[serviceId]})`;
        } else {
          console.warn(
            `[R_BOOK_ITEM] Map Mua (${serviceId}): Dịch vụ không đầy đủ hoặc không tìm thấy tên. Service: ${!!service}, Service Name Exists: ${
              service?.name !== undefined
            }, Quantity Exists: ${
              selectedServices[serviceId] !== undefined
            }. Trả về chuỗi rỗng.`
          );
          return "";
        }
      })
      .filter(Boolean)
      .join(", ");

    const bookingTotalPrice = this.calculateTotalPrice(
      selectedField,
      startTimeHour,
      startTimeMinute,
      endTimeHour,
      endTimeMinute,
      selectedServices
    );

    return (
      <tr key={index}>
        <td>{teamName}</td>
        <td>{captainName}</td>
        <td>{phoneNumber}</td>
        <td>{bookingDate}</td>
        <td>{fieldDisplayName}</td>
        <td>
          {startTime} - {endTime}
        </td>
        <td>{rentedServices}</td>
        <td>{soldServices}</td>
        <td>{bookingTotalPrice.toLocaleString("vi-VN")} VNĐ</td>{" "}
        {/* Định dạng lại tiền cho dễ đọc */}
        <td>
          <button
            type="button"
            onClick={() => this.handleRemoveBookingItem(index)}
          >
            Xóa
          </button>
        </td>
      </tr>
    );
  };

  render() {
    const { currentBooking, bookings, totalPrice, finalTotalPrice } =
      this.state;
    const { fieldPrices, isLoadingFields } = this.props;

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
                  <button
                    type="button"
                    id="viewCalendar"
                    className="icon-button"
                  >
                    <i className="far fa-calendar-alt"></i>{" "}
                  </button>
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
                <button type="button" onClick={this.handleCheckAvailability}>
                  Kiểm tra lịch đặt
                </button>
              </div>

              <div className="form-group services-group">
                <label>Chọn dịch vụ:</label>
                {this.renderServiceSection(-1, "Dịch vụ thuê", "Thuê")}{" "}
                {this.renderServiceSection(-1, "Dịch vụ mua", "Mua")}{" "}
              </div>

              <div className="form-group-book">
                <p>Tổng tiền dự kiến cho hóa đơn mới: {totalPrice} VNĐ</p>
                <button type="button" onClick={this.handleAddBookingItem}>
                  Thêm lịch đặt sân
                </button>
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
                        {bookings.map((booking, index) =>
                          this.renderBookingItem(booking, index)
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Phần hiển thị Tổng tiền cuối cùng */}
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
                  onClick={this.handleSendBookingsToBackend}
                >
                  Xác nhận đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
        <HomeFooter />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    // THÊM CÁC THUỘC TÍNH NÀY TỪ appReducer VÀO PROPS
    services: state.app.services,
    fieldPrices: state.app.fieldPrices,
    isLoadingServices: state.app.isLoadingServices,
    isLoadingFields: state.app.isLoadingFields,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // THÊM CÁC ACTION CREATORS NÀY VÀO PROPS
    fetchAllServices: () => dispatch(fetchAllServices()),
    fetchAllFields: () => dispatch(fetchAllFields()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(fieldBooking);
