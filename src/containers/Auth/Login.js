import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";

import "./Login.scss";
import { handleLoginApi } from "../../services/userService";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isShowPassword: false,
      errMessage: "",
    };
  }

  handleOnChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  handleOnChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  handleLogin = async () => {
    this.setState({ errMessage: "" });
    try {
      const data = await handleLoginApi(
        this.state.username,
        this.state.password
      );

      if (data && data.errCode !== 0) {
        this.setState({ errMessage: data.message });
      }

      if (data && data.errCode === 0) {
        const { user, token } = data;

        localStorage.setItem("token", token);
        this.props.userLoginSuccess({ ...user, token });

        if (user.role_id === 1) {
          this.props.navigate("/system/user-manage"); // Admin
        } else {
          this.props.navigate("/home"); // Người dùng thường
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        this.setState({ errMessage: error.response.data.message });
      }
    }
  };

  handleShowHidePassword = () => {
    this.setState((prevState) => ({
      isShowPassword: !prevState.isShowPassword,
    }));
  };

  render() {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.props.history.push("/login");
    }
    return (
      <div className="login-background">
        <div className="login-container">
          <div className="login-content row">
            <div className="col-12 login-text">Đăng nhập</div>
            <div className="col-12 form-group login-input">
              <label>Email : </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập email"
                value={this.state.username}
                onChange={this.handleOnChangeUsername}
              />
            </div>
            <div className="col-12 form-group login-input">
              <label>Mật khẩu : </label>
              <div className="custom-input-password">
                <input
                  type={this.state.isShowPassword ? "text" : "password"}
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
              <div className="col-12" style={{ color: "red" }}>
                {this.state.errMessage}
              </div>
            </div>
            <div className="col-12">
              <button className="btn-login" onClick={this.handleLogin}>
                Đăng nhập
              </button>
            </div>
            <div className="col-12">
              <span className="forgot-password">Quên mật khẩu</span>
            </div>
            <div className="col-12 text-center mt-4">
              <span className="text-other-login">Hoặc đăng nhập bằng : </span>
            </div>
            <div className="col-12 social-login">
              <i className="fab fa-google-plus-g google"></i>
              <i className="fab fa-facebook-f facebook"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  navigate: (path) => dispatch(push(path)),
  userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
});

export default connect(null, mapDispatchToProps)(Login);
