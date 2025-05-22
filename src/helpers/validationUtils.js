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
    const selectedDate = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      error = "Không thể xem lịch cho ngày trong quá khứ.";
    }

    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    threeMonthsLater.setHours(0, 0, 0, 0);

    if (selectedDate > threeMonthsLater) {
      error = "Chỉ có thể xem lịch trong vòng 3 tháng tới.";
    }
  } catch (e) {
    error = "Ngày đặt sân không hợp lệ.";
  }

  if (error) return error;

  const fieldExists = fieldPrices.some(
    (field) => field.field_id === selectedField
  );
  if (!fieldExists) {
    error = "Sân được chọn không tồn tại hoặc đã bị xóa.";
  }

  return error;
};
