import React from "react";

class CalendarModal extends React.Component {
  componentDidUpdate(prevProps) {
    if (
      this.props.isOpen &&
      this.props.data &&
      this.props.data.slots &&
      (prevProps.data === null ||
        prevProps.data.slots !== this.props.data.slots)
    ) {
      if (this.props.onDataFetched) {
        this.props.onDataFetched(this.props.data.slots);
      }
    }
  }

  formatTimeSlot = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const startDate = new Date(2000, 0, 1, hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    const endHours = endDate.getHours().toString().padStart(2, "0");
    const endMinutes = endDate.getMinutes().toString().padStart(2, "0");

    return `${timeString} - ${endHours}:${endMinutes}`;
  };

  render() {
    const {
      isOpen,
      onClose,
      isLoading,
      apiError,
      data,
      selectedDate,
      selectedField,
      fieldPrices,
    } = this.props;

    if (!isOpen) {
      return null;
    }

    const fieldName = fieldPrices
      ? fieldPrices.find(
          (field) => String(field.field_id) === String(selectedField)
        )?.field_name || selectedField
      : selectedField;

    return (
      <div className="custom-modal-overlay" onClick={onClose}>
        <div
          className="custom-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="custom-modal-header">
            <h3>
              Lịch Sân: {fieldName} - Ngày: {selectedDate}
            </h3>
            <button className="custom-close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="custom-modal-body">
            {isLoading ? (
              <p style={{ textAlign: "center" }}>Đang tải lịch đặt sân...</p>
            ) : apiError ? (
              <p
                className="error-message"
                style={{ color: "red", textAlign: "center" }}
              >
                {apiError}
              </p>
            ) : data && data.slots && data.slots.length > 0 ? (
              <div className="calendar-slots-grid">
                {data.slots.map((slot, index) => (
                  <div
                    key={slot.hour || index}
                    className={`calendar-slot ${
                      slot.status === "booked" ? "booked" : "available"
                    }`}
                  >
                    <span>{this.formatTimeSlot(slot.hour)}</span>
                    {slot.status === "booked" ? (
                      <span className="booked-team">({slot.team})</span>
                    ) : (
                      <span className="available-text">Trống</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center" }}>
                Không có lịch sân nào được tìm thấy hoặc tất cả các giờ đều có
                sẵn.
              </p>
            )}
          </div>
          <div className="custom-modal-footer">
            <button className="custom-btn-secondary" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CalendarModal;
