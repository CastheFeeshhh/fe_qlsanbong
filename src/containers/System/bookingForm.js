import React, { useState } from "react";

import "../../styles/bookingForm.scss";

const BookingForm = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    team_name: "",
    captain_name: "",
    phone: "",
    field: "",
    date_time: "",
    start_time: "",
    end_time: "",
    services: [],
    note: "",
  });

  return (
    <div className="book-wrapper">
      <h2>Bạn muốn đặt sân, vui lòng Chọn ngày và Xem khung giờ trống!</h2>
    </div>
  );
};

export default BookingForm;
