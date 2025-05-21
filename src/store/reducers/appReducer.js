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
  isLoadingServices: false,
  services: [],
  isLoadingFields: false,
  fieldPrices: [],
};
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    // ...
    case actionTypes.FETCH_ALL_SERVICES_START:
      return {
        ...state,
        isLoadingServices: true,
      };

    case actionTypes.FETCH_ALL_SERVICES_SUCCESS:
      return {
        ...state,
        isLoadingServices: false,
        services: action.data,
      };

    case actionTypes.FETCH_ALL_SERVICES_FAILED:
      return {
        ...state,
        isLoadingServices: false,
        services: [],
      };

    case actionTypes.FETCH_ALL_FIELDS_START:
      return {
        ...state,
        isLoadingFields: true,
      };

    case actionTypes.FETCH_ALL_FIELDS_SUCCESS:
      return {
        ...state,
        isLoadingFields: false,
        fieldPrices: action.data,
      };

    case actionTypes.FETCH_ALL_FIELDS_FAILED:
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
