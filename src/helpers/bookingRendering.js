import React from "react";
import { calculateTotalPrice } from "./bookingCalculations";
import { formatSelectedServices } from "./serviceUtils";

export const renderBookingItemRow = (
  booking,
  index,
  services,
  fieldPrices,
  handleRemoveBookingItemClick
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
  } = booking;

  const startTime = `${startTimeHour}:${startTimeMinute}`;
  const endTime = `${endTimeHour}:${endTimeMinute}`;

  const fieldDisplayName =
    fieldPrices.find((f) => f.field_id.toString() === selectedField)
      ?.field_name || `Sân ${selectedField}`;

  const rentedServices = formatSelectedServices(
    selectedServices,
    services,
    "Thuê"
  );
  const soldServices = formatSelectedServices(
    selectedServices,
    services,
    "Mua"
  );
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
      <td>{bookingTotalPrice.toLocaleString("vi-VN")} VNĐ</td>
      <td>
        <button
          type="button"
          onClick={() => handleRemoveBookingItemClick(index)}
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};
