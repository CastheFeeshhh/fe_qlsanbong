import React, { Component } from "react";
import axios from "axios";
import "./ResetPassword.scss";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      message: "",
      error: "",
      isValidToken: false,
      userEmail: "",
      token: "",
      emailFromUrl: "",
    };
  }

  async componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const email = queryParams.get("email");

    if (!token || !email) {
      this.setState({ error: "Liên kết đặt lại mật khẩu không đầy đủ." });
      return;
    }

    this.setState({ token: token, emailFromUrl: email });

    try {
      const response = await axios.get(
        `http://localhost:8081/api/reset-password?token=${token}&email=${email}`
      );
      if (response.data.errCode === 0) {
        this.setState({
          isValidToken: true,
          userEmail: response.data.userEmail,
          message: response.data.message,
          error: "",
        });
      } else {
        this.setState({
          isValidToken: false,
          error: response.data.message,
          message: "",
        });
      }
    } catch (err) {
      console.error("Error verifying token:", err);
      this.setState({
        isValidToken: false,
        error: "Có lỗi xảy ra khi xác thực liên kết. Vui lòng thử lại.",
        message: "",
      });
    }
  }

  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  handleResetPassword = async () => {
    const { password, confirmPassword, userEmail, token } = this.state;

    if (password !== confirmPassword) {
      this.setState({ error: "Mật khẩu nhập lại không khớp.", message: "" });
      return;
    }
    if (password.length < 6) {
      this.setState({
        error: "Mật khẩu phải có ít nhất 6 ký tự.",
        message: "",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8081/api/reset-password`,
        {
          email: userEmail,
          token: token,
          newPassword: password,
        }
      );

      if (response.data.errCode === 0) {
        this.setState({
          message:
            response.data.message +
            " Bạn sẽ được chuyển hướng đến trang đăng nhập.",
          error: "",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        this.setState({ error: response.data.message, message: "" });
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      this.setState({
        error: "Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.",
        message: "",
      });
    }
  };

  render() {
    const {
      password,
      confirmPassword,
      message,
      error,
      isValidToken,
      userEmail,
    } = this.state;
    return (
      <div className="reset-password-container">
        <div className="reset-password-form">
          <h2>Đặt lại mật khẩu</h2>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {isValidToken ? (
            <div>
              <div className="form-group">
                <label>Email của bạn:</label>
                <input
                  type="text"
                  className="form-control"
                  value={userEmail}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu mới:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "password")
                  }
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu mới:</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "confirmPassword")
                  }
                  placeholder="Xác nhận mật khẩu mới"
                />
              </div>
              <button
                className="btn btn-confirm-change"
                onClick={this.handleResetPassword}
              >
                Đặt lại mật khẩu
              </button>
            </div>
          ) : (
            <p>{error || "Đang xác thực liên kết..."}</p>
          )}
        </div>
      </div>
    );
  }
}

export default ResetPassword;
