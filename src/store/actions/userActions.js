import actionTypes from "./actionTypes";

export const addUserSuccess = () => ({
  type: actionTypes.ADD_USER_SUCCESS,
});

export const userLoginSuccess = (userInfo) => {
  console.log("token ở userAction: ", userInfo.token);
  return {
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfo: userInfo,
  };
};

export const userLoginFail = () => ({
  type: actionTypes.USER_LOGIN_FAIL,
});

export const processLogout = () => {
  localStorage.removeItem("token");
  return {
    type: actionTypes.PROCESS_LOGOUT,
  };
};

export const restoreLogin = (userInfo) => ({
  type: actionTypes.USER_LOGIN_SUCCESS,
  userInfo: userInfo,
});

// export const updateUserInfoInRedux = (updatedUserInfo) => {
//   return {
//     type: "UPDATE_USER_INFO",
//     payload: updatedUserInfo,
//   };
// };
