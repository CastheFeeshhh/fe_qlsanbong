import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { changePasswordService } from "../../services/userService";
import "../../styles/changePassword.scss";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      errMessage: "",
    };
  }

  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
      errMessage: "",
    });
  };

  validateInput = () => {
    if (
      !this.state.oldPassword ||
      !this.state.newPassword ||
      !this.state.confirmNewPassword
    ) {
      this.setState({ errMessage: "Vui lòng nhập đầy đủ các trường." });
      return false;
    }
    if (this.state.newPassword !== this.state.confirmNewPassword) {
      this.setState({
        errMessage: "Mật khẩu mới và mật khẩu xác nhận không khớp.",
      });
      return false;
    }
    if (this.state.newPassword.length < 5) {
      this.setState({ errMessage: "Mật khẩu mới phải có ít nhất 5 ký tự." });
      return false;
    }
    return true;
  };

  handleChangePassword = async () => {
    let isValid = this.validateInput();
    if (!isValid) return;

    try {
      let response = await changePasswordService({
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword,
      });

      if (response && response.errCode === 0) {
        toast.success("Đổi mật khẩu thành công!");
        alert("Đổi mật khẩu thành công!");
        this.setState({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
          errMessage: "",
        });
      } else {
        this.setState({ errMessage: response.errMessage });
      }
    } catch (e) {
      this.setState({ errMessage: "Có lỗi xảy ra, vui lòng thử lại." });
    }
  };

  render() {
    return (
      <div className="change-password-container">
        <div className="change-password-card">
          <h3 className="section-title">Đổi Mật Khẩu</h3>
          <div className="form-group">
            <label>Mật khẩu cũ</label>
            <input
              type="password"
              className="form-control"
              value={this.state.oldPassword}
              onChange={(e) => this.handleOnChangeInput(e, "oldPassword")}
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              value={this.state.newPassword}
              onChange={(e) => this.handleOnChangeInput(e, "newPassword")}
            />
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              value={this.state.confirmNewPassword}
              onChange={(e) =>
                this.handleOnChangeInput(e, "confirmNewPassword")
              }
            />
          </div>
          {this.state.errMessage && (
            <div className="error-message">{this.state.errMessage}</div>
          )}
          <button
            className="btn-save-password"
            onClick={this.handleChangePassword}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    );
  }
}

export default connect()(ChangePassword);
