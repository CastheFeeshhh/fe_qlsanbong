import React, { Component } from "react";
import { toast } from "react-toastify";
import {
  getAllAssets,
  createNewService,
  updateServiceData,
  deleteServiceData,
} from "../../services/manageService.js";
import { getAllServicesData } from "../../services/bookingService.js";
import AddServiceModal from "../../component/AddServiceModal.js";
import EditServiceModal from "../../component/EditServiceModal.js";
import "../../styles/serviceManage.scss";

class ServiceManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      assets: [],
      isLoading: true,
      error: null,
      isOpenAddModal: false,
      isOpenEditModal: false,
      serviceEdit: {},
    };
  }

  async componentDidMount() {
    await this.loadInitialData();
  }

  loadInitialData = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      let [servicesRes, assetsRes] = await Promise.all([
        getAllServicesData(),
        getAllAssets(),
      ]);
      let servicesList = Array.isArray(servicesRes) ? servicesRes : [];
      let assetsList =
        assetsRes && assetsRes.errCode === 0 && Array.isArray(assetsRes.assets)
          ? assetsRes.assets
          : [];
      this.setState({
        services: servicesList,
        assets: assetsList,
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        error: "Có lỗi xảy ra khi tải dữ liệu.",
        isLoading: false,
      });
      toast.error("Có lỗi xảy ra khi tải dữ liệu!");
    }
  };

  handleOpenAddModal = () => {
    this.setState({ isOpenAddModal: true });
  };

  toggleAddModal = () => {
    this.setState({ isOpenAddModal: !this.state.isOpenAddModal });
  };

  handleOpenEditModal = (service) => {
    this.setState({ isOpenEditModal: true, serviceEdit: service });
  };

  toggleEditModal = () => {
    this.setState({ isOpenEditModal: !this.state.isOpenEditModal });
  };

  doCreateNewService = async (data) => {
    try {
      let response = await createNewService(data);
      if (response && response.errCode !== 0) {
        toast.error(response.errMessage);
      } else {
        await this.loadInitialData();
        this.setState({ isOpenAddModal: false });
        toast.success("Thêm dịch vụ thành công!");
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  doEditService = async (data) => {
    try {
      let response = await updateServiceData(data);
      if (response && response.errCode !== 0) {
        toast.error(response.errMessage);
      } else {
        await this.loadInitialData();
        this.setState({ isOpenEditModal: false });
        toast.success("Cập nhật dịch vụ thành công!");
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  handleDeleteService = async (service) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa: " + service.name + "?")) {
      try {
        let response = await deleteServiceData(service.service_id);
        if (response && response.errCode === 0) {
          await this.loadInitialData();
          toast.success("Xóa dịch vụ thành công!");
        } else {
          toast.error(response.errMessage);
        }
      } catch (e) {
        toast.error("Có lỗi xảy ra!");
      }
    }
  };

  render() {
    const { services, assets, isLoading, error } = this.state;
    if (isLoading) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ DỊCH VỤ</h1>
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i> Đang tải...
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ DỊCH VỤ</h1>
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i> {error}
          </div>
          <button className="btn btn-primary" onClick={this.loadInitialData}>
            <i className="fas fa-sync-alt"></i> Thử lại
          </button>
        </div>
      );
    }

    const trackableAssets = assets.filter((asset) => asset.is_trackable === 1);

    return (
      <div className="system-main-content">
        <h1 className="title">QUẢN LÝ DỊCH VỤ</h1>
        <AddServiceModal
          isOpen={this.state.isOpenAddModal}
          toggleFromParent={this.toggleAddModal}
          createNewService={this.doCreateNewService}
          assets={trackableAssets}
        />
        <EditServiceModal
          isOpen={this.state.isOpenEditModal}
          toggleFromParent={this.toggleEditModal}
          currentService={this.state.serviceEdit}
          editService={this.doEditService}
          assets={trackableAssets}
        />

        <div className="admin-card">
          <div className="card-header">
            <h3>Danh sách dịch vụ</h3>
            <button
              className="btn btn-primary"
              onClick={this.handleOpenAddModal}
            >
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
                          <td>{service.service_id}</td>
                          <td>{service.name}</td>
                          <td className="text-right">
                            {parseFloat(service.price).toLocaleString("vi-VN")}
                          </td>
                          <td>{service.description}</td>
                          <td>{service.type}</td>
                          <td>
                            <div className="btn-action-group">
                              <button
                                className="btn btn-edit"
                                title="Sửa dịch vụ"
                                onClick={() =>
                                  this.handleOpenEditModal(service)
                                }
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-delete"
                                title="Xóa dịch vụ"
                                onClick={() =>
                                  this.handleDeleteService(service)
                                }
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
