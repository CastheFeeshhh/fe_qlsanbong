import axios from "../axios";

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

const getAllSuppliers = () => {
  return axios.get(`/api/get-all-suppliers`);
};

const getAllAssets = () => {
  return axios.get(`/api/get-all-assets`);
};

const getAllInvoices = () => {
  return axios.get(`/api/get-all-invoices`);
};

const getAllAssetInvoices = () => {
  return axios.get(`/api/get-all-asset-invoices`);
};

const createNewUserService = (data) => {
  console.log("check data from service : ", data);
  return axios.post("/api/create-new-user", data);
};

const deleteUserService = (userId) => {
  return axios.delete("/api/delete-user", {
    data: { user_id: userId },
  });
};

const editUserService = (data) => {
  return axios.put("/api/edit-user", data);
};

const createNewSupplierService = (data) => {
  return axios.post("/api/create-new-supplier", data);
};

const deleteSupplierService = (supplierId) => {
  return axios.delete("/api/delete-supplier", {
    data: { id: supplierId },
  });
};

const editSupplierService = (data) => {
  console.log("data:", data);
  return axios.put("/api/edit-supplier", data);
};

const createNewAssetService = (data) => {
  return axios.post("/api/create-new-asset", data);
};

const deleteAssetService = (assetId) => {
  return axios.delete("/api/delete-asset", {
    data: { id: assetId },
  });
};

const editAssetService = (inputData) => {
  return axios.put("/api/edit-asset", inputData);
};

const createNewService = (data) => {
  return axios.post("/api/create-new-service", data);
};

const updateServiceData = (data) => {
  return axios.put("/api/edit-service", data);
};

const deleteServiceData = (serviceId) => {
  return axios.delete("/api/delete-service", {
    data: { id: serviceId },
  });
};

const getInvoiceDetailsById = (bookingId) => {
  return axios.get(`/api/get-invoice-details?id=${bookingId}`);
};

export {
  getAllUsers,
  getAllAdmins,
  getAllStaffs,
  getAllCustomers,
  getAllSuppliers,
  getAllAssets,
  getAllInvoices,
  getAllAssetInvoices,
  createNewUserService,
  deleteUserService,
  editUserService,
  createNewSupplierService,
  deleteSupplierService,
  editSupplierService,
  createNewAssetService,
  deleteAssetService,
  editAssetService,
  createNewService,
  updateServiceData,
  deleteServiceData,
  getInvoiceDetailsById,
};
