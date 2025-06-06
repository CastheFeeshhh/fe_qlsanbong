import React, { Component } from "react";
import { toast } from "react-toastify";
import { getAllServicesData } from "../../services/bookingService";
import "../../styles/serviceManage.scss";

class ServiceManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      isLoading: true,
      error: null,
    };
  }

  async componentDidMount() {
    await this.loadServices();
  }

  loadServices = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      let response = await getAllServicesData();
      if (Array.isArray(response)) {
        this.setState({
          services: response,
          isLoading: false,
        });
      } else {
        throw new Error("Dữ liệu nhận được không phải là một mảng.");
      }
    } catch (e) {
      console.error("Lỗi khi tải danh sách dịch vụ:", e);
      let errorMessage = "Có lỗi xảy ra khi tải danh sách dịch vụ.";
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

  render() {
    const { services, isLoading, error } = this.state;

    if (isLoading) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ DỊCH VỤ</h1>
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            Đang tải danh sách dịch vụ...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ DỊCH VỤ</h1>
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
          <button className="btn btn-primary" onClick={this.loadServices}>
            <i className="fas fa-sync-alt"></i>
            Thử lại
          </button>
        </div>
      );
    }

    return (
      <div className="system-main-content">
        <h1 className="title">QUẢN LÝ DỊCH VỤ</h1>
        <div className="admin-card">
          <div className="card-header">
            <h3>Danh sách dịch vụ</h3>
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Thêm dịch vụ mới
            </button>
          </div>
          <div className="card-body">
            <div className="user-role-group">
              <h4 className="role-group-title">
                Dịch vụ hiện có - {services.length}
              </h4>
              <div className="table-responsive">
                <table id="services-table" className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên Dịch Vụ</th>
                      <th className="text-right">Giá (VNĐ)</th>
                      <th>Mô Tả</th>
                      <th>Loại Hình</th>
                      <th className="text-center">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services && services.length > 0 ? (
                      services.map((service) => (
                        <tr key={service.service_id}>
                          <td data-label="ID">{service.service_id}</td>
                          <td data-label="Tên Dịch Vụ">{service.name}</td>
                          <td data-label="Giá (VNĐ)" className="text-right">
                            {service.price
                              ? parseFloat(service.price).toLocaleString(
                                  "vi-VN"
                                )
                              : "N/A"}
                          </td>
                          <td data-label="Mô Tả">{service.description}</td>
                          <td data-label="Loại Hình">{service.type}</td>
                          <td data-label="Thao Tác">
                            <div className="btn-action-group">
                              <button
                                className="btn btn-edit"
                                title="Sửa dịch vụ"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-delete"
                                title="Xóa dịch vụ"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center p-20">
                          Không có dịch vụ nào để hiển thị.
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

export default ServiceManage;
