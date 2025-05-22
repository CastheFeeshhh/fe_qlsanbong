import { createBookingService } from "../services/bookingService";
import {
  calculateTotalPrice,
  validateBookingData,
} from "./bookingCalculations";
import { formatSelectedServices } from "./serviceUtils";

export const sendBookingsToBackend = async (
  bookings,
  fieldPrices,
  services,
  resetFormCallback
) => {
  if (bookings.length === 0) {
    alert("Vui lòng thêm ít nhất một hóa đơn đặt sân để gửi.");
    return { success: false, message: "No bookings to send." };
  }

  try {
    let allBookingsSuccessful = true;
    let errorMessage = "";

    for (const bookingItem of bookings) {
      const fieldInfo = fieldPrices.find(
        (f) => f.field_id.toString() === bookingItem.selectedField
      );
      if (!fieldInfo) {
        console.error(
          `Không tìm thấy thông tin sân với ID: ${bookingItem.selectedField}`
        );
        errorMessage = `Lỗi: Không tìm thấy thông tin sân ${bookingItem.selectedField}. Vui lòng chọn lại.`;
        allBookingsSuccessful = false;
        break;
      }

      const calculatedTotalPrice = calculateTotalPrice(
        bookingItem.selectedField,
        bookingItem.startTimeHour,
        bookingItem.startTimeMinute,
        bookingItem.endTimeHour,
        bookingItem.endTimeMinute,
        bookingItem.selectedServices,
        fieldPrices,
        services
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
        services: Object.keys(bookingItem.selectedServices).map((serviceId) => {
          const serviceInfo = services.find(
            (s) => s.service_id.toString() === serviceId
          );
          return {
            service_id: parseInt(serviceId, 10),
            quantity: bookingItem.selectedServices[serviceId],
            price_at_booking: serviceInfo ? parseFloat(serviceInfo.price) : 0,
          };
        }),
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
        errorMessage = `Lỗi khi đặt sân cho đội ${bookingItem.teamName}: ${
          res.message || JSON.stringify(res)
        }`;
        allBookingsSuccessful = false;
        break;
      }
    }

    if (allBookingsSuccessful) {
      alert("Tất cả các yêu cầu đặt sân đã được gửi thành công!");
      resetFormCallback();
      return { success: true, message: "All bookings sent successfully!" };
    } else {
      alert(
        errorMessage ||
          "Có lỗi xảy ra, một số yêu cầu đặt sân không được gửi thành công."
      );
      return {
        success: false,
        message: errorMessage || "Some bookings failed.",
      };
    }
  } catch (error) {
    console.error("Lỗi trong quá trình gửi yêu cầu đặt sân:", error);
    alert("Đã có lỗi xảy ra khi gửi yêu cầu đặt sân. Vui lòng thử lại.");
    return {
      success: false,
      message: "An error occurred during booking submission.",
    };
  }
};

export const removeBookingItem = (
  currentBookings,
  indexToRemove,
  fieldPrices,
  services
) => {
  const updatedBookings = [...currentBookings];

  if (indexToRemove < 0 || indexToRemove >= updatedBookings.length) {
    console.warn("Invalid index for removeBookingItem:", indexToRemove);
    return { updatedBookings: currentBookings, priceChange: 0 };
  }

  const bookingToRemove = updatedBookings[indexToRemove];

  const priceOfRemovedBooking = calculateTotalPrice(
    bookingToRemove.selectedField,
    bookingToRemove.startTimeHour,
    bookingToRemove.startTimeMinute,
    bookingToRemove.endTimeHour,
    bookingToRemove.endTimeMinute,
    bookingToRemove.selectedServices,
    fieldPrices,
    services
  );

  updatedBookings.splice(indexToRemove, 1);

  return {
    updatedBookings: updatedBookings,
    priceChange: -priceOfRemovedBooking,
  };
};

export const addBookingItem = (
  currentBooking,
  existingBookings,
  fieldPrices,
  services
) => {
  const validationResult = validateBookingData(currentBooking);

  if (!validationResult.isValid) {
    console.error("Booking validation failed:", validationResult.errorMessage);
    return null;
  }

  const bookingTotalPrice = calculateTotalPrice(
    currentBooking.selectedField,
    currentBooking.startTimeHour,
    currentBooking.startTimeMinute,
    currentBooking.endTimeHour,
    currentBooking.endTimeMinute,
    currentBooking.selectedServices,
    fieldPrices,
    services
  );

  const newBooking = {
    ...currentBooking,
    totalPrice: bookingTotalPrice,
  };

  const updatedBookings = [...existingBookings, newBooking];

  const newCurrentBookingState = {
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
  };

  return {
    updatedBookings,
    priceOfAddedBooking: bookingTotalPrice,
    newCurrentBookingState,
  };
};
