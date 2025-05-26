import actionTypes from "./actionTypes";
import {
  getAllServicesData,
  getAllFieldsData,
} from "../../services/bookingService";

export const appStartUpComplete = () => ({
  type: actionTypes.APP_START_UP_COMPLETE,
});

export const setContentOfConfirmModal = (contentOfConfirmModal) => ({
  type: actionTypes.SET_CONTENT_OF_CONFIRM_MODAL,
  contentOfConfirmModal: contentOfConfirmModal,
});

export const fetchAllServices = () => {
  return async (dispatch, getState) => {
    try {
      // console.log("Action: Dispatching FETCH_ALL_SERVICES_START");
      dispatch({ type: actionTypes.FETCH_ALL_SERVICES_START });

      let res = await getAllServicesData();
      // console.log("Action: getAllServicesData response:", res);

      if (res && Array.isArray(res) && res.length > 0) {
        // console.log(
        //   "Action: Dispatching FETCH_ALL_SERVICES_SUCCESS with data."
        // );
        dispatch({
          type: actionTypes.FETCH_ALL_SERVICES_SUCCESS,
          data: res,
        });
      } else {
        console.warn(
          "Action: No data or invalid data from getAllServicesData. Dispatching FETCH_ALL_SERVICES_FAILED."
        );
        dispatch({ type: actionTypes.FETCH_ALL_SERVICES_FAILED });
      }
    } catch (e) {
      // console.log("fetchAllServices error", e);
      dispatch({ type: actionTypes.FETCH_ALL_SERVICES_FAILED });
    }
  };
};

export const fetchAllFields = () => {
  return async (dispatch, getState) => {
    try {
      // console.log("Action: Dispatching FETCH_ALL_FIELDS_START");
      dispatch({ type: actionTypes.FETCH_ALL_FIELDS_START });

      let res = await getAllFieldsData();
      // console.log("Action: getAllFieldsData response:", res);

      if (res && Array.isArray(res) && res.length > 0) {
        // console.log("Action: Dispatching FETCH_ALL_FIELDS_SUCCESS with data.");
        dispatch({
          type: actionTypes.FETCH_ALL_FIELDS_SUCCESS,
          data: res,
        });
      } else {
        console.warn(
          "Action: No data or invalid data from getAllFieldsData. Dispatching FETCH_ALL_FIELDS_FAILED."
        );
        dispatch({ type: actionTypes.FETCH_ALL_FIELDS_FAILED });
      }
    } catch (e) {
      console.error("Action: fetchAllFields error:", e);
      dispatch({ type: actionTypes.FETCH_ALL_FIELDS_FAILED });
    }
  };
};
