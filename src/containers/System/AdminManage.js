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

        <div className="admin-card">
          <div className="card-header">
            <h3>Danh sách nhân viên</h3>
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i> Thêm người dùng mới
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
                        <th>EMAIL</th>
                        <th>FIRST NAME</th>
                        <th>LAST NAME</th>
                        <th>ADDRESS</th>
                        <th>PHONE NUMBER</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userGroups[roleGroup].length > 0 ? (
                        userGroups[roleGroup].map((user) => (
                          <tr key={user.user_id || user.email}>
                            {" "}
                            <td data-label="Email">{user.email}</td>
                            <td data-label="First Name">{user.first_name}</td>
                            <td data-label="Last Name">{user.last_name}</td>
                            <td data-label="Address">{user.address}</td>
                            <td data-label="Phone Number">{user.phone}</td>
                            <td
                              data-label="Actions"
                              className="btn-action-group"
                            >
                              <button className="btn btn-edit">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="btn btn-delete">
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              color: "#666",
                            }}
                          >
                            Không có người dùng nào thuộc nhóm này.
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
