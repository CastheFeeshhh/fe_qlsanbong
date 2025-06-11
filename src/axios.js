import axios from "axios";
import _ from "lodash";
import { path } from "./utils/constant";
import { dispatch } from "./redux";
import actionTypes from "./store/actions/actionTypes";

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
        dispatch({ type: actionTypes.PROCESS_LOGOUT });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
