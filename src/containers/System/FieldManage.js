import React, { Component } from "react";
import "../../styles/system.scss";
import {
  getAllCustomers,
  createNewUserService,
  deleteUserService,
  editUserService,
} from "../../services/userService";

import ModalUser from "../../component/ModalUser";
import ModalEditUser from "../../component/ModalEditUser";
import { emitter } from "../../utils/emitter";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class FieldManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      loading: true,
      error: null,
      isOpenModalUser: false,
      isOpenModalEditUser: false,
      userEdit: {},
    };
  }

  async componentDidMount() {
    await this.loadUsers();
  }

  loadUsers = async () => {
    this.setState({ loading: true, error: null });

    try {
      const customerRes = await getAllCustomers();
      const customersWithRole = customerRes.users.map((user) => ({
        ...user,
        role: "customer",
      }));

      this.setState({
        customers: customersWithRole,
        loading: false,
      });
    } catch (err) {
      console.error("Error loading customers:", err);
      this.setState({
        error:
          "Failed to fetch customers. Please check your network and try again.",
        loading: false,
      });
      toast.error("Tải dữ liệu khách hàng thất bại!");
    }
  };

  handleAddNewUser = () => {
    this.setState({
      isOpenModalUser: true,
    });
  };

  toggleUserModal = () => {
    this.setState({
      isOpenModalUser: !this.state.isOpenModalUser,
    });
  };

  createNewUser = async (data) => {
    console.log("Dữ liệu nhận từ ModalUser:", data);

    try {
      const newUser = {
        ...data,
        position_id: "1",
      };

      console.log("Dữ liệu gửi đi cho createNewUserService:", newUser);

      let response = await createNewUserService(newUser);
      console.log("Phản hồi từ createNewUserService:", response);

      if (response && response.errCode !== 0) {
        if (response.errMessage) {
          toast.error(response.errMessage);
        } else {
          toast.error("Thêm khách hàng thất bại!");
        }
      } else if (response && response.errCode === 0) {
        await this.loadUsers();
        this.setState({
          isOpenModalUser: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
        toast.success("Thêm khách hàng mới thành công!");
      } else {
        toast.error(
          "Không nhận được phản hồi hợp lệ từ máy chủ. Vui lòng thử lại!"
        );
      }
    } catch (e) {
      console.error("Lỗi khi tạo khách hàng mới:", e);

      if (e.response && e.response.data && e.response.data.errMessage) {
        toast.error(e.response.data.errMessage);
      } else if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else if (e.message) {
        toast.error(`Lỗi kết nối: ${e.message}`);
      } else {
        toast.error("Có lỗi xảy ra khi thêm khách hàng mới!");
      }
    }
  };

  handleEditUser = (user) => {
    this.setState({
      isOpenModalEditUser: true,
      userEdit: user,
    });
  };

  toggleUserEditModal = () => {
    this.setState({
      isOpenModalEditUser: !this.state.isOpenModalEditUser,
    });
  };

  doEditUser = async (user) => {
    try {
      const { gender, ...userDataWithoutGender } = user;
      let res = await editUserService(userDataWithoutGender);
      if (res && res.errCode === 0) {
        this.setState({
          isOpenModalEditUser: false,
        });
        await this.loadUsers();
        toast.success("Cập nhật thông tin khách hàng thành công!");
      } else {
        toast.error(
          res.errCode + " - " + res.errMessage || "Cập nhật thất bại!"
        );
      }
    } catch (e) {
      console.error("Error editing customer:", e);
      toast.error("Có lỗi xảy ra khi cập nhật khách hàng!");
    }
  };

  handleDeleteUser = async (user) => {
    try {
      let res = await deleteUserService(user.id || user.user_id);

      if (res && res.errCode === 0) {
        await this.loadUsers();
        toast.success("Xóa khách hàng thành công!");
      } else {
        toast.error(res.errMessage || "Xóa khách hàng thất bại!");
      }
    } catch (e) {
      console.error("Error deleting customer:", e);
      toast.error("Có lỗi xảy ra khi xóa khách hàng!");
    }
  };

  render() {
    const { customers, loading, error } = this.state;

    const userGroups = {
      "Khách hàng": customers,
    };

    if (loading) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ KHÁCH HÀNG</h1>
          <div className="loading-state">Đang tải dữ liệu khách hàng...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ KHÁCH HÀNG</h1>
          <div className="error-state">{error}</div>
        </div>
      );
    }

    return (
      <div className="system-main-content">
        <h1 className="title">QUẢN LÝ KHÁCH HÀNG</h1>

        <ModalUser
          isOpen={this.state.isOpenModalUser}
          toggleFromParent={this.toggleUserModal}
          roleIdToAssign={"3"}
          createNewUser={this.createNewUser}
        />

        {this.state.isOpenModalEditUser && (
          <ModalEditUser
            isOpen={this.state.isOpenModalEditUser}
            toggleFromParent={this.toggleUserEditModal}
            currentUser={this.state.userEdit}
            editUser={this.doEditUser}
          />
        )}

        <div className="admin-card">
          <div className="card-header">
            <h3>Danh sách khách hàng</h3>
            <button className="btn btn-primary" onClick={this.handleAddNewUser}>
              <i className="fas fa-plus"></i> Thêm khách hàng mới
            </button>
          </div>
          <div className="card-body">
            {Object.keys(userGroups).map((roleGroup) => (
              <div key={roleGroup} className="user-role-group">
                <h4 className="role-group-title">
                  {roleGroup} - {userGroups[roleGroup].length}
                </h4>
                <div className="table-responsive">
                  <table id="customers">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Họ đệm</th>
                        <th>Tên</th>
                        <th>Địa chỉ</th>
                        <th>Số điện thoại</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userGroups[roleGroup].length > 0 ? (
                        userGroups[roleGroup].map((user) => (
                          <tr key={user.id || user.email || user.user_id}>
                            <td data-label="Email">{user.email}</td>
                            <td data-label="First Name">{user.first_name}</td>
                            <td data-label="Last Name">{user.last_name}</td>
                            <td data-label="Address">{user.address}</td>
                            <td data-label="Phone Number">
                              {user.phone_number || user.phone}
                            </td>
                            <td
                              data-label="Actions"
                              className="btn-action-group"
                            >
                              <button
                                className="btn btn-edit"
                                onClick={() => this.handleEditUser(user)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-delete"
                                onClick={() => this.handleDeleteUser(user)}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              color: "#666",
                            }}
                          >
                            Không có khách hàng nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default FieldManage;
