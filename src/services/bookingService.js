import axios from "../axios";

const getAllServicesData = () => {
  return axios.get("/api/get-all-services");
};

const getAllFieldsData = () => {
  return axios.get("/api/get-all-fields");
};

const getSchedules = (data) => {
  console.log(data.field_id);
  return axios.get("/api/get-all-schedules", {
    params: {
      field_id: data.field_id,
      date: data.date,
    },
  });
};

const createBookingService = (data) => {
  return axios.post("/api/create-booking", data);
};

export {
  getAllServicesData,
  getAllFieldsData,
  getSchedules,
  createBookingService,
};
