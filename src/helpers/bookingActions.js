import moment from "moment";
import {
  createNewBooking,
  addDetailBooking,
  addServiceBooking,
  addServiceBookingDetail,
} from "../services/bookingService";
import {
  calculateTotalPrice,
  validateBookingData,
} from "./bookingCalculations";

const isTimeSlotOverlapping = (
  newStartTime,
  newEndTime,
  existingBookings,
  currentFieldId,
  currentBookingDate
) => {
  const newStart = moment(newStartTime, "HH:mm");
  const newEnd = moment(newEndTime, "HH:mm");

  if (newEnd.isSameOrBefore(newStart)) {
    return "Thời gian kết thúc phải sau thời gian bắt đầu.";
  }

  const durationMinutes = newEnd.diff(newStart, "minutes");
  if (durationMinutes < 60) {
    return "Thời gian đặt sân tối thiểu là 1 giờ.";
  }

  for (let i = 0; i < existingBookings.length; i++) {
    const existingBooking = existingBookings[i];

    if (
      String(existingBooking.fieldId || existingBooking.selectedField) ===
        String(currentFieldId) &&
      existingBooking.bookingDate === currentBookingDate
    ) {
      const existingStart = moment(existingBooking.startTime, "HH:mm");
      const existingEnd = moment(existingBooking.endTime, "HH:mm");

      if (newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)) {
        const teamName =
          existingBooking.teamName || existingBooking.team || "Đội khác";
        return `Thời gian bạn chọn (${newStart.format(
          "HH:mm"
        )} - ${newEnd.format(
          "HH:mm"
        )}) bị trùng với lịch đặt sân của ${teamName} vào lúc ${existingStart.format(
          "HH:mm"
        )} - ${existingEnd.format("HH:mm")}.`;
      }
    }
  }
  return "";
};

export const addBookingItem = (
  currentBooking,
  bookings,
  fieldPrices,
  services,
  fieldBookingsDataFromDB
) => {
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
  } = currentBooking;

  const validationResult = validateBookingData(currentBooking);
  if (!validationResult.isValid) {
    alert(validationResult.errorMessage);
    return null;
  }

  const startTime = `${startTimeHour}:${startTimeMinute}`;
  const endTime = `${endTimeHour}:${endTimeMinute}`;

  const dbBookedSlots =
    fieldBookingsDataFromDB && fieldBookingsDataFromDB.slots
      ? fieldBookingsDataFromDB.slots
          .filter((slot) => slot.status === "booked")
          .map((slot) => ({
            startTime: slot.hour,
            endTime: moment(slot.hour, "HH:mm")
              .add(fieldBookingsDataFromDB.minutesStep || 30, "minutes")
              .format("HH:mm"),
            teamName: slot.team,
            fieldId: fieldBookingsDataFromDB.fieldId,
            bookingDate: fieldBookingsDataFromDB.date,
          }))
      : [];

  const allExistingBookingsForOverlapCheck = [...bookings, ...dbBookedSlots];

  const overlapError = isTimeSlotOverlapping(
    startTime,
    endTime,
    allExistingBookingsForOverlapCheck,
    selectedField,
    bookingDate
  );

  if (overlapError) {
    alert(overlapError);
    return null;
  }

  const bookingTotalPrice = calculateTotalPrice(
    selectedField,
    startTimeHour,
    startTimeMinute,
    endTimeHour,
    endTimeMinute,
    selectedServices,
    fieldPrices,
    services
  );

  const newBooking = {
    ...currentBooking,
    startTime: startTime,
    endTime: endTime,
    totalPrice: bookingTotalPrice,
    servicesFormatted:
      Object.keys(selectedServices).length > 0
        ? Object.entries(selectedServices)
            .map(([serviceId, quantity]) => {
              const service = services.find(
                (s) => String(s.service_id) === String(serviceId)
              );
              return service ? `${service.service_name} (x${quantity})` : "";
            })
            .filter(Boolean)
            .join(", ")
        : "Không có",
  };

  const updatedBookings = [...bookings, newBooking];

  const newCurrentBookingState = {
    teamName: "",
    captainName: "",
    phoneNumber: "",
    bookingDate: currentBooking.bookingDate,
    selectedField: currentBooking.selectedField,
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

  const priceOfRemovedBooking =
    bookingToRemove.totalPrice !== undefined
      ? bookingToRemove.totalPrice
      : calculateTotalPrice(
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

export const sendBookingsToBackend = async (
  bookings,
  finalTotalPrice,
  resetFormCallback,
  history // Add history parameter
) => {
  if (bookings.length === 0) {
    alert("Vui lòng thêm ít nhất một hóa đơn đặt sân để gửi.");
    return { success: false, message: "Không có hóa đơn để gửi." };
  }

  try {
    let fieldBooking = await createNewBooking(9, finalTotalPrice); // user tạo sẽ được cập nhật sau, sau khi thêm phân quyền và đăng nhập
    let fieldBookingId = fieldBooking.booking_id;
    console.log("dữ liệu bookings :", bookings);

    for (const bookingItem of bookings) {
      let detailBooking = await addDetailBooking(bookingItem, fieldBookingId);
      let detailBookingId = detailBooking.booking_detail_id;

      if (Object.keys(bookingItem.selectedServices).length > 0) {
        let serviceBooking = await addServiceBooking(detailBookingId);
        let serviceBookingId = serviceBooking.service_booking_id;
        let serviceBookingObject = bookingItem.selectedServices;

        const formattedServices = Object.entries(serviceBookingObject).map(
          ([key, value]) => {
            return {
              key: Number(key),
              value: value,
            };
          }
        );
        console.log("id mới sv:", serviceBookingId, " - ", formattedServices);
        for (const serviceDetail of formattedServices) {
          const { key: serviceId, value: quantity } = serviceDetail;
          console.log(serviceId, "+", quantity);
          await addServiceBookingDetail(serviceBookingId, serviceId, quantity);
        }
      }
    }

    alert("Đặt sân thành công!");
    console.log(1);
    console.log(2);
    const orderInfoToSend = {
      booking_id: fieldBookingId,
      final_total_price: finalTotalPrice,
      booking_details: bookings,
    };
    console.log(3);

    return { success: true, message: "Đặt sân thành công!" };
  } catch (error) {
    console.error("Lỗi khi gửi dữ liệu đặt sân:", error);
    let errorMessage = "Đã xảy ra lỗi khi gửi dữ liệu đặt sân.";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    alert(errorMessage);
    return { success: false, message: errorMessage };
  }
};
