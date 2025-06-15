import axios from "../axios";

const getAllServicesData = () => {
  return axios.get("/api/get-all-services");
};

const getAllFieldsData = () => {
  return axios.get("/api/get-all-fields");
};

const getSchedules = (data) => {
  console.log(
    "Fetching schedules for field_id:",
    data.field_id,
    "on date:",
    data.date
  );
  return axios.get("/api/get-all-schedules", {
    params: {
      field_id: data.field_id,
      date: data.date,
    },
  });
};

const getBookingScheduleByDate = (date) => {
  return axios.get(`/api/booking-schedule?date=${date}`);
};

const createNewBooking = (id, finalTotalPrice) => {
  return axios.post("/api/add-new-booking", {
    user_id: id,
    status: "Đang chờ",
    price_estimate: finalTotalPrice,
  });
};

const addDetailBooking = (data, id) => {
  console.log("id: ", id, " - data:", data);
  return axios.post("/api/add-detail-booking", {
    booking_id: id,
    field_id: data.selectedField,
    date: data.bookingDate,
    start_time: data.startTime,
    end_time: data.endTime,
    team_name: data.teamName,
    captain_name: data.captainName,
    booking_phone: data.phoneNumber,
  });
};

const addServiceBooking = (id) => {
  return axios.post("/api/add-new-service-booking", {
    booking_detail_id: id,
  });
};

const addServiceBookingDetail = (id, serviceId, quantity) => {
  return axios.post("/api/add-service-booking-detail", {
    service_booking_id: id,
    service_id: serviceId,
    quantity: quantity,
  });
};

const createNewFieldService = (data) => {
  return axios.post("/api/create-new-field", data);
};

const deleteFieldService = (fieldId) => {
  return axios.delete("/api/delete-field", {
    data: { id: fieldId },
  });
};

const editFieldService = (inputData) => {
  return axios.put("/api/edit-field", inputData);
};

export {
  getAllServicesData,
  getAllFieldsData,
  getSchedules,
  getBookingScheduleByDate,
  createNewBooking,
  addDetailBooking,
  addServiceBooking,
  addServiceBookingDetail,
  createNewFieldService,
  deleteFieldService,
  editFieldService,
};
