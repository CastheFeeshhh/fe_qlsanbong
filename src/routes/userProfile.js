import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import * as actions from "../store/actions";
import { editUserService } from "../services/userService";
import { updateUserInfoInRedux } from "../store/actions/userActions";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import defaultAvatar from "../assets/images/default_avatar.jpg";
import "../styles/userProfile.scss";
import moment from "moment";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: this.props.userInfo?.user_id || "",
      email: this.props.userInfo?.email || "",
      first_name: this.props.userInfo?.first_name || "",
      last_name: this.props.userInfo?.last_name || "",
      address: this.props.userInfo?.address || "",
      phone: this.props.userInfo?.phone || "",
      gender: this.props.userInfo?.gender || "Nam",
      avatar: this.props.userInfo?.avatar || "",
      created_at: this.props.userInfo?.created_at || "",

      isEditMode: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.userInfo !== prevProps.userInfo) {
      this.setState({
        user_id: this.props.userInfo?.user_id,
        email: this.props.userInfo?.email,
        first_name: this.props.userInfo?.first_name,
        last_name: this.props.userInfo?.last_name,
        address: this.props.userInfo?.address,
        phone: this.props.userInfo?.phone,
        gender: this.props.userInfo?.gender,
        avatar: this.props.userInfo?.avatar,
        created_at: this.props.userInfo?.created_at,
      });
    }
  }

  handleToggleEditMode = () => {
    if (this.state.isEditMode) {
      this.setState({
        first_name: this.props.userInfo?.first_name || "",
        last_name: this.props.userInfo?.last_name || "",
        address: this.props.userInfo?.address || "",
        phone: this.props.userInfo?.phone || "",
        gender: this.props.userInfo?.gender || "Nam",
      });
    }
    this.setState((prevState) => ({
      isEditMode: !prevState.isEditMode,
    }));
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleUpdateUser = async () => {
    try {
      let dataToUpdate = {
        user_id: this.state.user_id,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        address: this.state.address,
        phone: this.state.phone,
        gender: this.state.gender,
      };

      let response = await editUserService(dataToUpdate);
      if (response && response.errCode === 0) {
        this.props.updateUserInfoInRedux(dataToUpdate);

        toast.success("Cập nhật thông tin thành công!");
        this.setState({ isEditMode: false });
      } else {
        toast.error(response.errMessage || "Cập nhật thất bại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật!");
      console.error(error);
    }
  };

  render() {
    const {
      email,
      first_name,
      last_name,
      address,
      phone,
      gender,
      avatar,
      created_at,
      isEditMode,
    } = this.state;
    const fullName = `${last_name || ""} ${first_name || ""}`.trim();
    const roleId = this.props.userInfo?.role_id;

    return (
      <div className="user-profile-container">
        <HomeHeader />
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-container">
              <img
                src={avatar || defaultAvatar}
                alt="User Avatar"
                className="avatar"
              />
            </div>
            <h2>{fullName}</h2>
            <p className="email">{email}</p>
          </div>
          <div className="profile-body">
            <h3 className="section-title">Thông tin chi tiết</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Họ đệm</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="last_name"
                    value={last_name || ""}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  <span>{last_name || "Chưa cập nhật"}</span>
                )}
              </div>
              <div className="info-item">
                <label>Tên</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="first_name"
                    value={first_name || ""}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  <span>{first_name || "Chưa cập nhật"}</span>
                )}
              </div>
              <div className="info-item">
                <label>Số điện thoại</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={phone || ""}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  <span>{phone || "Chưa cập nhật"}</span>
                )}
              </div>
              <div className="info-item">
                <label>Giới tính</label>
                {isEditMode ? (
                  <select
                    name="gender"
                    value={gender || "Nam"}
                    onChange={this.handleInputChange}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                ) : (
                  <span>{gender || "Chưa cập nhật"}</span>
                )}
              </div>
              <div className="info-item full-width">
                <label>Địa chỉ</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="address"
                    value={address || ""}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  <span>{address || "Chưa cập nhật"}</span>
                )}
              </div>
              <div className="info-item">
                <label>Vai trò</label>
                <span>
                  {roleId === 1
                    ? "Quản trị viên"
                    : roleId === 2
                    ? "Nhân viên"
                    : "Khách hàng"}
                </span>
              </div>
              <div className="info-item">
                <label>Ngày tham gia</label>
                <span>{moment(created_at).format("DD/MM/YYYY")}</span>
              </div>
            </div>
          </div>
          <div className="profile-footer">
            {isEditMode ? (
              <>
                <button className="btn-save" onClick={this.handleUpdateUser}>
                  Lưu thay đổi
                </button>
                <button
                  className="btn-cancel"
                  onClick={this.handleToggleEditMode}
                >
                  Hủy
                </button>
              </>
            ) : (
              <button
                className="btn-edit-profile"
                onClick={this.handleToggleEditMode}
              >
                Chỉnh sửa thông tin
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserInfoInRedux: (data) => dispatch(updateUserInfoInRedux(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
