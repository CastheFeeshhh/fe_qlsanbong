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

const getAllSuppliers = () => {
  return axios.get(`/api/get-all-suppliers`);
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

const createVnpayPayment = async (bookingId, amount, orderInfo) => {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/vnpay/create_payment_url`;

  const payload = { bookingId, amount, orderInfo };

  try {
    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    let parsedData = undefined;

    if (responseText) {
      try {
        parsedData = JSON.parse(responseText);
      } catch (jsonParseError) {
        console.error(
          "FETCH TEST: ERROR parsing JSON from Fetch text:",
          jsonParseError
        );

        console.error("Malformed JSON string from Fetch:", responseText);
      }
    } else {
      console.log("FETCH TEST 9: Response text is empty or null.");
    }

    if (!response.ok) {
      console.error("FETCH TEST 10: Fetch response not OK. Returning error.");

      return {
        errCode: response.status,
        errMessage: parsedData?.errMessage || `Lỗi server: ${response.status}`,
      };
    }

    return parsedData;
  } catch (error) {
    console.error(
      "FETCH TEST 12: Error caught in createVnpayPayment (Fetch API):",
      error
    );

    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      return {
        errCode: -1,
        errMessage: "Lỗi mạng hoặc server không phản hồi.",
      };
    }

    return {
      errCode: -1,
      errMessage: `Lỗi kết nối hoặc không xác định: ${error.message}`,
    };
  } finally {
  }
};
export {
  handleLoginApi,
  handleRegisterApi,
  handleForgotPasswordApi,
  getAllUsers,
  getAllAdmins,
  getAllStaffs,
  getAllCustomers,
  getAllSuppliers,
  createNewUserService,
  deleteUserService,
  editUserService,
  createVnpayPayment,
};
