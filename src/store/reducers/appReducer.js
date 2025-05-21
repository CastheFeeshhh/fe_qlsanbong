import actionTypes from "../actions/actionTypes";

const initContentOfConfirmModal = {
  isOpen: false,
  messageId: "",
  handleFunc: null,
  dataFunc: null,
};

const initialState = {
  started: true,
  language: "vi",
  systemMenuPath: "/system/user-manage",
  contentOfConfirmModal: {
    ...initContentOfConfirmModal,
  },
  isLoadingServices: false, // Cờ này sẽ là true khi đang fetch, false khi hoàn thành
  services: [], // Mảng này sẽ chứa danh sách các dịch vụ (sau khi fetch thành công)
  isLoadingFields: false, // Cờ này sẽ là true khi đang fetch, false khi hoàn thành
  fieldPrices: [], // Mảng này sẽ chứa danh sách các sân và giá của chúng
};
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    // ...
    case actionTypes.FETCH_ALL_SERVICES_START: // SỬA ĐÂY
      return {
        ...state,
        isLoadingServices: true,
      };

    case actionTypes.FETCH_ALL_SERVICES_SUCCESS: // SỬA ĐÂY
      return {
        ...state,
        isLoadingServices: false,
        services: action.data,
      };

    case actionTypes.FETCH_ALL_SERVICES_FAILED: // SỬA ĐÂY
      return {
        ...state,
        isLoadingServices: false,
        services: [],
      };

    case actionTypes.FETCH_ALL_FIELDS_START: // SỬA ĐÂY (tùy chọn)
      return {
        ...state,
        isLoadingFields: true,
      };

    case actionTypes.FETCH_ALL_FIELDS_SUCCESS: // SỬA ĐÂY (tùy chọn)
      return {
        ...state,
        isLoadingFields: false,
        fieldPrices: action.data,
      };

    case actionTypes.FETCH_ALL_FIELDS_FAILED: // SỬA ĐÂY (tùy chọn)
      return {
        ...state,
        isLoadingFields: false,
        fieldPrices: [],
      };
    default:
      return state;
  }
};

export default appReducer;
