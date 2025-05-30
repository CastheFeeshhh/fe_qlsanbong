import axios from "../axios";

const handleLoginApi = (email, password) => {
  return axios.post("/api/login", {
    email: email,
    password: password,
  });
};

const handleRegisterApi = (data) => {
  return axios.post("/api/register", data);
};

const handleForgotPasswordApi = (email) => {
  return axios.post("/api/forgot-password", { email });
};

const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`);
};

const getAllAdmins = () => {
  return axios.get(`/api/get-all-admins`);
};

const getAllStaffs = () => {
  return axios.get(`/api/get-all-staffs`);
};

const getAllCustomers = () => {
  return axios.get(`/api/get-all-customers`);
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

export {
  handleLoginApi,
  handleRegisterApi,
  handleForgotPasswordApi,
  getAllUsers,
  getAllAdmins,
  getAllStaffs,
  getAllCustomers,
  createNewUserService,
  deleteUserService,
  editUserService,
};
