import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";

import "./Login.scss";
import {
  handleLoginApi,
  handleRegisterApi,
  handleForgotPasswordApi,
} from "../../services/userService";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isShowPassword: false,
      errMessage: "",

      regEmail: "",
      regPassword: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      address: "",
      gender: "M",
      phone: "",
      avatar: "",
      roleId: "3",
      positionId: "1",
      activeTab: "login",
      activeForm: "login",
      forgotPasswordEmail: "",
    };
  }

  componentDidMount() {
    this.setState({ errMessage: "" });

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const user_id = urlParams.get("user_id");
    const role_id = urlParams.get("role_id");
    const errorMessage = urlParams.get("message");
    const loginStatus = urlParams.get("status");

    if (token && user_id && role_id) {
      const user_id = urlParams.get("user_id");
      const role_id = urlParams.get("role_id");
      const first_name = decodeURIComponent(urlParams.get("first_name") || "");
      const last_name = decodeURIComponent(urlParams.get("last_name") || "");
      const address = decodeURIComponent(urlParams.get("address") || "");
      const phone = decodeURIComponent(urlParams.get("phone") || "");
      const gender = decodeURIComponent(urlParams.get("gender") || "");
      const avatar = decodeURIComponent(urlParams.get("avatar") || "");
      const created_at = decodeURIComponent(urlParams.get("created_at") || "");

      localStorage.setItem("jwtToken", token);

      const userInfo = {
        user_id: +user_id,
        role_id: +role_id,
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        gender: gender,
        avatar: avatar,
        address: address,
        created_at: created_at,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      this.props.userLoginSuccess(userInfo);

      toast.success("Đăng nhập thành công!");

      if (role_id === "1") {
        this.props.navigate("/system/user-manage");
      } else {
        this.props.navigate("/home");
      }

      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (loginStatus === "error" && errorMessage) {
      const decodedErrorMessage = decodeURIComponent(errorMessage);
      this.setState({ errMessage: decodedErrorMessage });
      toast.error(decodedErrorMessage);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (window.history.replaceState && window.location.search) {
      const cleanUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
    }
  }

  handleOnChangeEmail = (event) => {
    this.setState({ email: event.target.value, errMessage: "" });
  };

  handleOnChangePassword = (event) => {
    this.setState({ password: event.target.value, errMessage: "" });
  };

  handleOnChangeRegisterInput = (event, name) => {
    let stateCopy = { ...this.state };
    stateCopy[name] = event.target.value;
    this.setState({
      ...stateCopy,
      errMessage: "",
    });
  };

  handleOnChangeForgotPasswordEmail = (event) => {
    this.setState({ forgotPasswordEmail: event.target.value, errMessage: "" });
  };

  handleForgotPasswordRequest = async () => {
    this.setState({ errMessage: "" });
    const { forgotPasswordEmail } = this.state;

    if (!forgotPasswordEmail) {
      this.setState({ errMessage: "Vui lòng nhập địa chỉ email của bạn." });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      this.setState({ errMessage: "Email không đúng định dạng." });
      return;
    }

    try {
      const response = await handleForgotPasswordApi(forgotPasswordEmail);

      if (response && response.errCode === 0) {
        this.setState({
          errMessage: "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.",
          forgotPasswordEmail: "",
        });
      } else {
        this.setState({
          errMessage:
            response.message ||
            "Có lỗi xảy ra khi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        this.setState({
          errMessage:
            error.response.data.message || error.response.data.errMessage,
        });
      } else {
        this.setState({ errMessage: "Lỗi kết nối hoặc không xác định." });
      }
      console.error("Forgot password request error: ", error);
    }
  };

  handleFormChange = (form) => {
    this.setState({ activeForm: form, errMessage: "" });
  };

  handleLogin = async () => {
    this.setState({ errMessage: "" });
    try {
      const data = await handleLoginApi(this.state.email, this.state.password);

      if (data && data.errCode !== 0) {
        this.setState({ errMessage: data.message });
      }

      if (data && data.errCode === 0) {
        const { user, token } = data;
        console.log("data1:", data);

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        this.props.userLoginSuccess({ ...user, token });

        if (user.role_id === 1) {
          this.props.navigate("/system/user-manage");
        } else {
          this.props.navigate("/home");
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        this.setState({ errMessage: error.response.data.message });
      } else {
        this.setState({ errMessage: "Lỗi kết nối hoặc không xác định." });
      }
      console.error("Login error: ", error);
    }
  };

  handleRegister = async () => {
    this.setState({ errMessage: "" });
    const {
      regEmail,
      regPassword,
      confirmPassword,
      firstName,
      lastName,
      address,
      gender,
      phone,
      roleId,
      positionId,
    } = this.state;

    if (
      !regEmail ||
      !regPassword ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !phone
    ) {
      this.setState({
        errMessage: "Vui lòng điền đầy đủ tất cả các trường bắt buộc.",
      });
      return;
    }

    if (regPassword !== confirmPassword) {
      this.setState({ errMessage: "Mật khẩu xác nhận không khớp!" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      this.setState({ errMessage: "Email không đúng định dạng." });
      return;
    }

    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      this.setState({ errMessage: "Số điện thoại không đúng định dạng." });
      return;
    }

    try {
      const response = await handleRegisterApi({
        email: regEmail,
        password: regPassword,
        first_name: firstName,
        last_name: lastName,
        address: address || null,
        gender: gender === "M" ? "Nam" : gender === "F" ? "Nữ" : null,
        phone: phone,
        role_id: +roleId,
        position_id: +positionId,
      });

      if (response && response.errCode === 0) {
        this.setState({
          errMessage: "Đăng ký thành công! Vui lòng đăng nhập.",
        });
        this.handleTabChange("login");
        this.setState({
          regEmail: "",
          regPassword: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          address: "",
          gender: "M",
          phone: "",
          avatar: "",
        });
        alert("Đăng ký thành công! Vui lòng đăng nhập tài khoản để sử dụng.");
      } else {
        this.setState({
          errMessage:
            response.errMessage || "Đăng ký thất bại. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        this.setState({
          errMessage:
            error.response.data.message || error.response.data.errMessage,
        });
      } else {
        this.setState({
          errMessage: "Lỗi kết nối hoặc không xác định khi đăng ký.",
        });
      }
      console.error("Register error: ", error);
    }
  };

  handleShowHidePassword = () => {
    this.setState((prevState) => ({
      isShowPassword: !prevState.isShowPassword,
    }));
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab, activeForm: tab, errMessage: "" });
  };

  handleGoogleLoginRedirect = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
  };

  handleFacebookLoginRedirect = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/facebook`;
  };

  render() {
    const { activeForm, activeTab } = this.state;
    const { userInfo, isLoggedIn } = this.props;

    if (isLoggedIn) {
      if (userInfo) {
        if (userInfo.role_id === "1" || userInfo.role_id === "2") {
          return <Redirect to={"/system/user-manage"} />;
        } else if (userInfo.role_id === 3) {
          return <Redirect to={"/home"} />;
        }
      }
      return <Redirect to={"/home"} />;
    }

    return (
      <div className="login-page-container">
        <div className="login-box-wrapper">
          <div className="login-header-tabs">
            <div
              className={`tab-item ${activeTab === "login" ? "active" : ""}`}
              onClick={() => this.handleTabChange("login")}
            >
              Đăng nhập
            </div>
            <div
              className={`tab-item ${activeTab === "register" ? "active" : ""}`}
              onClick={() => this.handleTabChange("register")}
            >
              Đăng ký
            </div>
          </div>

          {activeForm === "login" && (
            <div className="login-form-container">
              <div className="login-logo"></div>
              <div className="login-form-header">Đăng nhập hệ thống</div>
              <div className="login-content">
                <div className="form-group">
                  <label htmlFor="email">Email : </label>
                  <input
                    type="text"
                    id="email"
                    className="form-control"
                    placeholder="Nhập email của bạn"
                    value={this.state.email}
                    onChange={this.handleOnChangeEmail}
                  />
                </div>
                <div className="form-group password-group">
                  <label htmlFor="password">Mật khẩu : </label>
                  <div className="custom-input-password">
                    <input
                      type={this.state.isShowPassword ? "text" : "password"}
                      id="password"
                      className="form-control"
                      placeholder="Nhập mật khẩu"
                      onChange={this.handleOnChangePassword}
                    />
                    <span onClick={this.handleShowHidePassword}>
                      <i
                        className={
                          this.state.isShowPassword
                            ? "far fa-eye"
                            : "fas fa-eye-slash"
                        }
                      ></i>
                    </span>
                  </div>
                </div>
                {this.state.errMessage && (
                  <div className="error-message">{this.state.errMessage}</div>
                )}
                <div className="forgot-password">
                  <span onClick={() => this.handleFormChange("forgotPassword")}>
                    Quên mật khẩu?
                  </span>
                </div>
                <button className="btn-login" onClick={this.handleLogin}>
                  Đăng nhập
                </button>
              </div>
              <div className="login-divider">
                <div className="line"></div>
                <span>Hoặc</span>
                <div className="line"></div>
              </div>
              <div className="social-login">
                <div
                  className="social-icon-wrapper google-icon-wrapper"
                  onClick={this.handleGoogleLoginRedirect}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fab fa-google-plus-g google-icon"></i>
                </div>

                <div
                  className="social-icon-wrapper facebook-icon-wrapper"
                  onClick={this.handleFacebookLoginRedirect}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fab fa-facebook-f facebook-icon"></i>
                </div>
              </div>
            </div>
          )}

          {activeForm === "register" && (
            <div className="register-form-container">
              <div className="login-logo"></div>
              <div className="login-form-header">Đăng ký tài khoản</div>
              <div className="login-content">
                <div className="form-group">
                  <label htmlFor="regEmail">Email:</label>
                  <input
                    type="email"
                    id="regEmail"
                    className="form-control"
                    placeholder="Nhập email của bạn"
                    value={this.state.regEmail}
                    onChange={(event) =>
                      this.handleOnChangeRegisterInput(event, "regEmail")
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="regPassword">Mật khẩu:</label>
                  <input
                    type="password"
                    id="regPassword"
                    className="form-control"
                    placeholder="Nhập mật khẩu"
                    value={this.state.regPassword}
                    onChange={(event) =>
                      this.handleOnChangeRegisterInput(event, "regPassword")
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Xác nhận mật khẩu"
                    value={this.state.confirmPassword}
                    onChange={(event) =>
                      this.handleOnChangeRegisterInput(event, "confirmPassword")
                    }
                  />
                </div>
                <div className="form-row">
                  <div className="form-group half-width">
                    <label htmlFor="firstName">Tên:</label>
                    <input
                      type="text"
                      id="firstName"
                      className="form-control"
                      placeholder="Nhập tên của bạn"
                      value={this.state.firstName}
                      onChange={(event) =>
                        this.handleOnChangeRegisterInput(event, "firstName")
                      }
                    />
                  </div>
                  <div className="form-group half-width">
                    <label htmlFor="lastName">Họ:</label>
                    <input
                      type="text"
                      id="lastName"
                      className="form-control"
                      placeholder="Nhập họ của bạn"
                      value={this.state.lastName}
                      onChange={(event) =>
                        this.handleOnChangeRegisterInput(event, "lastName")
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="address">Địa chỉ (không bắt buộc):</label>
                  <input
                    type="text"
                    id="address"
                    className="form-control"
                    placeholder="Nhập địa chỉ"
                    value={this.state.address}
                    onChange={(event) =>
                      this.handleOnChangeRegisterInput(event, "address")
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Giới tính (Không bắt buộc):</label>
                  <select
                    id="gender"
                    className="form-control"
                    value={this.state.gender}
                    onChange={(event) =>
                      this.handleOnChangeRegisterInput(event, "gender")
                    }
                  >
                    <option value="M">Nam</option>
                    <option value="F">Nữ</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại:</label>
                  <input
                    type="text"
                    id="phone"
                    className="form-control"
                    placeholder="Nhập số điện thoại"
                    value={this.state.phone}
                    onChange={(event) =>
                      this.handleOnChangeRegisterInput(event, "phone")
                    }
                  />
                </div>

                {this.state.errMessage && (
                  <div className="error-message">{this.state.errMessage}</div>
                )}
                <button className="btn-register" onClick={this.handleRegister}>
                  Đăng ký
                </button>
              </div>
            </div>
          )}

          {activeForm === "forgotPassword" && (
            <div className="forgot-password-form-container">
              <div className="login-logo"></div>
              <div className="login-form-header">Quên mật khẩu</div>
              <div className="login-content">
                <div className="form-group">
                  <label htmlFor="forgotPasswordEmail">Email của bạn:</label>
                  <input
                    type="email"
                    id="forgotPasswordEmail"
                    className="form-control"
                    placeholder="Nhập email đã đăng ký"
                    value={this.state.forgotPasswordEmail}
                    onChange={this.handleOnChangeForgotPasswordEmail}
                  />
                </div>
                {this.state.errMessage && (
                  <div className="error-message">{this.state.errMessage}</div>
                )}
                <button
                  className="btn-login"
                  onClick={this.handleForgotPasswordRequest}
                >
                  Gửi yêu cầu đặt lại mật khẩu
                </button>
                <div
                  className="back-to-login"
                  onClick={() => this.handleFormChange("login")}
                >
                  <i className="fas fa-arrow-left"></i> Quay lại đăng nhập
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => ({
  navigate: (path) => dispatch(push(path)),
  userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
