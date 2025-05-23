import moment from "moment";

export const validateCalendarSelection = (
  bookingDate,
  selectedField,
  fieldPrices
) => {
  let error = "";

  if (!bookingDate && !selectedField) {
    error = "Vui lòng chọn ngày và sân.";
  } else if (!bookingDate) {
    error = "Vui lòng chọn ngày đặt sân.";
  } else if (!selectedField) {
    error = "Vui lòng chọn sân.";
  }

  if (error) return error;

  try {
    const selectedDateMoment = moment(bookingDate, "YYYY-MM-DD");
    const todayMoment = moment().startOf("day");
    const threeMonthsLaterMoment = moment().add(3, "months").endOf("day");

    if (!selectedDateMoment.isValid()) {
      error = "Ngày đặt sân không hợp lệ.";
    } else if (selectedDateMoment.isBefore(todayMoment)) {
      error = "Không thể xem lịch cho ngày trong quá khứ.";
    } else if (selectedDateMoment.isAfter(threeMonthsLaterMoment)) {
      error = "Chỉ có thể xem lịch trong vòng 3 tháng tới.";
    }
  } catch (e) {
    error = "Định dạng ngày đặt sân không đúng.";
  }

  if (error) return error;

  const fieldExists = fieldPrices.some(
    (field) => String(field.field_id) === String(selectedField)
  );
  if (!fieldExists) {
    error = "Sân được chọn không tồn tại hoặc đã bị xóa.";
  }

  return error;
};
