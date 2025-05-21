import axios from "../axios";

const handleLoginApi = (email, password) => {
  return axios.post("/api/login", {
    email: email,
    password: password,
  });
};

const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`);
};

const createNewUserService = (data) => {
  console.log("check data from service : ", data);
  return axios.post("/api/create-new-user", data);
};

const deleteUserService = (userId) => {
  console.log("check:", userId);
  return axios.delete("/api/delete-user", {
    data: { user_id: userId },
  });
};

const editUserService = (inputData) => {
  return axios.put("/api/edit-user", inputData);
};

const getAllServicesData = () => {
  return axios.get("/api/get-all-service");
};

const getAllFieldsData = () => {
  return axios.get("/api/get-all-field");
};

const createBookingService = (data) => {
  return axios.post("/api/create-booking", data);
};

export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllServicesData,
  getAllFieldsData,
  createBookingService,
};
