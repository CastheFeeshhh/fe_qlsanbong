import React, { Component } from "react";
import "../../styles/system.scss";
import {
  getAllAdmins,
  getAllStaffs,
  getAllCustomers,
} from "../../services/userService";

class AdminManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: [],
      staffs: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = async () => {
    this.setState({ loading: true, error: null });

    try {
      const adminRes = await getAllAdmins();
      const staffRes = await getAllStaffs();

      const adminsWithRole = adminRes.users.map((user, index) => {
        return {
          ...user,
          role: "admin",
        };
      });
      console.log("a1.5", adminsWithRole);

      const staffsWithRole = staffRes.users.map((user, index) => {
        return {
          ...user,
          role: "staff",
        };
      });

      this.setState({
        admins: adminsWithRole,
        staffs: staffsWithRole,
        loading: false,
      });
    } catch (err) {
      console.error("Error loading users:", err);
      this.setState({
        error:
          "Failed to fetch users. Please check your network and try again.",
        loading: false,
      });
    }
  };

  render() {
    const { admins, staffs, loading, error } = this.state;

    const userGroups = {
      Admin: admins,
      "Nhân viên": staffs,
    };

    if (loading) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ NHÂN VIÊN</h1>
          <div className="loading-state">Đang tải dữ liệu người dùng...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ NHÂN VIÊN</h1>
          <div className="error-state">{error}</div>
        </div>
      );
    }

    return (
      <div className="system-main-content">
        <h1 className="title">QUẢN LÝ NHÂN VIÊN</h1>

        {/* <ModalUser
          isOpen={this.state.isOpenModalUser}
          toggleFromParent={this.toggleUserModal}
          createNewUser={this.createNewUser}
        />

        {this.state.isOpenModalEditUser && (
          <ModalEditUser
            isOpen={this.state.isOpenModalEditUser}
            toggleFromParent={this.toggleUserEditModal}
            currentUser={this.state.userEdit}
            editUser={this.doEditUser}
          />
        )} */}

        <div className="admin-card">
          <div className="card-header">
            <h3>Danh sách khách hàng</h3>
            <button className="btn btn-primary" onClick={this.handleAddNewUser}>
              <i className="fas fa-plus"></i> Thêm nhân viên mới
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
                            Không có nh nào.
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

export default AdminManage;
