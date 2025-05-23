export const calculateTotalPrice = (
  selectedFieldId,
  startTimeHour,
  startTimeMinute,
  endTimeHour,
  endTimeMinute,
  selectedServices,
  fieldPrices,
  services
) => {
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
        costNormalRate = (endTotalMinutes - startTotalMinutes) * pricePerMinute;
      } else if (startTotalMinutes >= sixteenOClockInMinutes) {
        costDoubleRate =
          (endTotalMinutes - startTotalMinutes) *
          pricePerMinute *
          DOUBLE_PRICE_FACTOR;
      } else {
        const minutesBefore16 = sixteenOClockInMinutes - startTotalMinutes;
        costNormalRate = minutesBefore16 * pricePerMinute;

        const minutesAfter16 = endTotalMinutes - sixteenOClockInMinutes;
        costDoubleRate = minutesAfter16 * pricePerMinute * DOUBLE_PRICE_FACTOR;
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

  const finalPrice = fieldPrice + servicesPrice;
  return isNaN(finalPrice) || finalPrice < 0 ? 0 : finalPrice;
};

export const validateBookingData = (bookingData, services) => {
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
  } = bookingData;

  const errors = {};
  let isValid = true;

  if (!teamName) {
    isValid = false;
    errors.teamName = "Tên đội bóng không được để trống.";
  }
  if (!captainName) {
    isValid = false;
    errors.captainName = "Họ tên đội trưởng không được để trống.";
  }
  if (!phoneNumber) {
    isValid = false;
    errors.phoneNumber = "Số điện thoại không được để trống.";
  }
  if (!bookingDate) {
    isValid = false;
    errors.bookingDate = "Ngày đặt không được để trống.";
  }
  if (!selectedField) {
    isValid = false;
    errors.selectedField = "Vui lòng chọn sân.";
  }

  const cleanedPhoneNumber = phoneNumber.replace(/\s/g, "");
  if (phoneNumber && !/^\d+$/.test(cleanedPhoneNumber)) {
    isValid = false;
    errors.phoneNumber = "Số điện thoại không hợp lệ. Vui lòng chỉ nhập số.";
  } else if (
    phoneNumber &&
    (cleanedPhoneNumber.length < 9 || cleanedPhoneNumber.length > 11)
  ) {
    isValid = false;
    errors.phoneNumber = "Số điện thoại phải có từ 9 đến 11 chữ số.";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(bookingDate);
  selectedDate.setHours(0, 0, 0, 0);

  if (bookingDate && selectedDate < today) {
    isValid = false;
    errors.bookingDate = "Ngày đặt không thể là ngày trong quá khứ.";
  } else if (bookingDate && selectedDate.getTime() === today.getTime()) {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const startHour = parseInt(startTimeHour);
    const startMinute = parseInt(startTimeMinute);

    if (
      startHour < currentHour ||
      (startHour === currentHour && startMinute < currentMinute)
    ) {
      isValid = false;
      errors.startTime = "Giờ đặt không thể sớm hơn giờ hiện tại.";
    }
  }

  const startMinutes = parseInt(startTimeHour) * 60 + parseInt(startTimeMinute);
  const endMinutes = parseInt(endTimeHour) * 60 + parseInt(endTimeMinute);

  const earliestStartMinutes = 6 * 60;
  const latestEndMinutes = 22 * 60;

  if (startMinutes >= endMinutes) {
    isValid = false;
    errors.timeSlot = "Giờ bắt đầu phải nhỏ hơn giờ kết thúc.";
  }

  if (startMinutes < earliestStartMinutes || endMinutes > latestEndMinutes) {
    isValid = false;
    errors.timeSlot = `Thời gian đặt sân phải trong khoảng từ ${
      earliestStartMinutes / 60
    }h00 đến ${latestEndMinutes / 60}h00.`;
  }

  const minDurationMinutes = 60;
  const duration = endMinutes - startMinutes;

  if (duration < minDurationMinutes) {
    isValid = false;
    errors.duration = "Thời gian đặt sân tối thiểu là 60 phút (1 giờ).";
  }

  const MAX_SERVICE_QUANTITY = 50;
  for (const serviceId in selectedServices) {
    const quantity = selectedServices[serviceId];
    if (quantity <= 0) {
      isValid = false;
      errors.services = "Số lượng dịch vụ phải là số dương.";
      break;
    }
    if (quantity > MAX_SERVICE_QUANTITY) {
      isValid = false;
      errors.services = `Số lượng dịch vụ không được vượt quá ${MAX_SERVICE_QUANTITY}.`;
      break;
    }
  }

  const firstErrorMessage = Object.values(errors)[0] || "";

  return { isValid, errorMessage: firstErrorMessage, errors };
};

export const checkFieldAvailability = (currentBookingData) => {
  const {
    bookingDate,
    selectedField,
    startTimeHour,
    startTimeMinute,
    endTimeHour,
    endTimeMinute,
  } = currentBookingData;

  const startTime = `${startTimeHour}:${startTimeMinute}`;
  const endTime = `${endTimeHour}:${endTimeMinute}`;

  console.log(
    "Kiểm tra lịch đặt cho:",
    bookingDate,
    selectedField,
    startTime,
    endTime
  );
};

export const getBookingPriceDetails = (bookingData, fieldPrices, services) => {
  const newTotalPrice = calculateTotalPrice(
    bookingData.selectedField,
    bookingData.startTimeHour,
    bookingData.startTimeMinute,
    bookingData.endTimeHour,
    bookingData.endTimeMinute,
    bookingData.selectedServices,
    fieldPrices,
    services
  );

  return {
    updatedBooking: bookingData,
    newTotalPrice: newTotalPrice,
  };
};
