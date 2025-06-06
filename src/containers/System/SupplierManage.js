import React, { Component } from "react";
import { toast } from "react-toastify";
import { getAllSuppliers } from "../../services/userService";
import "../../styles/supplierManage.scss";

class SupplierManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suppliers: [],
      isLoading: true,
      error: null,
    };
  }

  async componentDidMount() {
    await this.loadSuppliers();
  }

  loadSuppliers = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      let response = await getAllSuppliers();
      console.log(response);
      if (response && response.errCode === 0) {
        this.setState({
          suppliers: response.suppliers || [],
          isLoading: false,
        });
      } else if (Array.isArray(response)) {
        this.setState({
          suppliers: response,
          isLoading: false,
        });
      } else {
        throw new Error(
          response.errMessage || "Dữ liệu nhận được không hợp lệ."
        );
      }
    } catch (e) {
      console.error("Lỗi khi tải danh sách nhà cung cấp:", e);
      let errorMessage = "Có lỗi xảy ra khi tải danh sách nhà cung cấp.";
      if (e.response && e.response.data && e.response.data.errMessage) {
        errorMessage = e.response.data.errMessage;
      } else if (e.message) {
        errorMessage = e.message;
      }
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  };

  formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Intl.DateTimeFormat("vi-VN", options).format(
        new Date(dateString)
      );
    } catch (error) {
      return dateString;
    }
  };

  render() {
    const { suppliers, isLoading, error } = this.state;

    if (isLoading) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ NHÀ CUNG CẤP</h1>
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            Đang tải dữ liệu...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ NHÀ CUNG CẤP</h1>
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
          <button className="btn btn-primary" onClick={this.loadSuppliers}>
            <i className="fas fa-sync-alt"></i>
            Thử lại
          </button>
        </div>
      );
    }

    return (
      <div className="system-main-content">
        <h1 className="title">QUẢN LÝ NHÀ CUNG CẤP</h1>
        <div className="admin-card">
          <div className="card-header">
            <h3>Danh sách nhà cung cấp</h3>
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Thêm nhà cung cấp
            </button>
          </div>
          <div className="card-body">
            <div className="user-role-group">
              <h4 className="role-group-title">
                Nhà cung cấp - {suppliers.length}
              </h4>
              <div className="table-responsive">
                <table id="suppliers-table" className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên Nhà Cung Cấp</th>
                      <th>Số Điện Thoại</th>
                      <th>Địa Chỉ</th>
                      <th>Mô Tả</th>
                      <th>Ngày Tạo</th>
                      <th className="text-center">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers && suppliers.length > 0 ? (
                      suppliers.map((supplier) => (
                        <tr key={supplier.supplier_id}>
                          <td data-label="ID">{supplier.supplier_id}</td>
                          <td data-label="Tên NCC">{supplier.name}</td>
                          <td data-label="Số Điện Thoại">{supplier.phone}</td>
                          <td data-label="Địa Chỉ">{supplier.address}</td>
                          <td data-label="Mô Tả">{supplier.description}</td>
                          <td data-label="Ngày Tạo">
                            {this.formatDate(supplier.created_at)}
                          </td>
                          <td data-label="Thao Tác">
                            <div className="btn-action-group">
                              <button
                                className="btn btn-edit"
                                title="Sửa nhà cung cấp"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-delete"
                                title="Xóa nhà cung cấp"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center p-20">
                          Không có nhà cung cấp nào để hiển thị.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SupplierManage;
