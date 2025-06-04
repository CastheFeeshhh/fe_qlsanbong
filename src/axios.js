import axios from "axios";
import _ from "lodash";
import { path } from "./utils/constant";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Nếu bạn dùng Redux, hãy cân nhắc dispatch action logout tại đây
        // hoặc đảm bảo App.js xử lý việc này khi không tìm thấy token/user.
        if (window.location.pathname !== path.LOGIN) {
          window.location.href = path.LOGIN;
        }
      } else if (status === 403) {
        if (window.location.pathname !== path.ACCESS_DENIED) {
          window.location.href = path.ACCESS_DENIED;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
