import React, { Component } from "react";
import { toast } from "react-toastify";
import {
  getAllFieldsData,
  createNewFieldService,
  deleteFieldService,
  editFieldService,
} from "../../services/bookingService";
import "../../styles/fieldManage.scss";
import AddFieldModal from "../../component/AddFieldModal";
import EditFieldModal from "../../component/EditFieldModal";

class FieldManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      isLoading: true,
      error: null,
      isOpenCreateModal: false,
      isOpenEditModal: false,
      fieldEdit: {},
    };
  }

  async componentDidMount() {
    await this.loadFields();
  }

  loadFields = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      let response = await getAllFieldsData();
      if (Array.isArray(response)) {
        this.setState({
          fields: response,
          isLoading: false,
        });
      } else {
        throw new Error("Dữ liệu nhận được không phải là một mảng.");
      }
    } catch (e) {
      this.setState({
        error: "Có lỗi xảy ra khi tải danh sách.",
        isLoading: false,
      });
      toast.error("Có lỗi xảy ra khi tải danh sách!");
    }
  };

  handleAddNewField = () => {
    this.setState({ isOpenCreateModal: true });
  };

  toggleCreateModal = () => {
    this.setState({ isOpenCreateModal: !this.state.isOpenCreateModal });
  };

  createNewField = async (data) => {
    try {
      let response = await createNewFieldService(data);
      if (response && response.errCode !== 0) {
        toast.error(response.errMessage);
      } else {
        await this.loadFields();
        this.setState({ isOpenCreateModal: false });
        toast.success("Thêm sân mới thành công!");
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  handleDeleteField = async (field) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sân này?")) {
      try {
        let res = await deleteFieldService(field.field_id);
        if (res && res.errCode === 0) {
          await this.loadFields();
          toast.success("Xóa sân thành công!");
        } else {
          toast.error(res.errMessage);
        }
      } catch (e) {
        toast.error("Có lỗi xảy ra!");
      }
    }
  };

  handleEditField = (field) => {
    this.setState({
      isOpenEditModal: true,
      fieldEdit: field,
    });
  };

  toggleEditModal = () => {
    this.setState({ isOpenEditModal: !this.state.isOpenEditModal });
  };

  doEditField = async (field) => {
    try {
      let res = await editFieldService(field);
      if (res && res.errCode === 0) {
        this.setState({ isOpenEditModal: false });
        await this.loadFields();
        toast.success("Cập nhật thông tin sân thành công!");
      } else {
        toast.error(res.errMessage);
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
  };

  render() {
    const {
      fields,
      isLoading,
      error,
      isOpenCreateModal,
      isOpenEditModal,
      fieldEdit,
    } = this.state;

    if (isLoading) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ SÂN BÓNG</h1>
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            Đang tải danh sách sân bóng...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ SÂN BÓNG</h1>
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
          <button className="btn btn-primary" onClick={this.loadFields}>
            <i className="fas fa-sync-alt"></i>
            Thử lại
          </button>
        </div>
      );
    }

    return (
      <div className="system-main-content">
        <h1 className="title">QUẢN LÝ SÂN BÓNG</h1>
        {isOpenCreateModal && (
          <AddFieldModal
            isOpen={isOpenCreateModal}
            toggleFromParent={this.toggleCreateModal}
            createNewField={this.createNewField}
          />
        )}
        {isOpenEditModal && (
          <EditFieldModal
            isOpen={isOpenEditModal}
            toggleFromParent={this.toggleEditModal}
            currentField={fieldEdit}
            editField={this.doEditField}
          />
        )}
        <div className="admin-card">
          <div className="card-header">
            <h3>Danh sách sân bóng </h3>
            <button
              className="btn btn-primary"
              onClick={this.handleAddNewField}
            >
              <i className="fas fa-plus"></i>
              Thêm sân mới
            </button>
          </div>
          <div className="card-body">
            <div className="user-role-group">
              <h4 className="role-group-title">
                Sân hiện có - {fields.length}
              </h4>
              <div className="table-responsive">
                <table id="fields-table" className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên Sân</th>
                      <th className="text-right">Giá/Phút</th>
                      <th className="text-right">Giá/Giờ</th>
                      <th>Loại Sân</th>
                      <th>Mô Tả</th>
                      <th>Trạng Thái</th>
                      <th>Hình Ảnh</th>
                      <th>Ngày Tạo</th>
                      <th className="text-center">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields && fields.length > 0 ? (
                      fields.map((field) => (
                        <tr key={field.field_id}>
                          <td data-label="ID">{field.field_id}</td>
                          <td data-label="Tên Sân">{field.field_name}</td>
                          <td data-label="Giá/Phút" className="text-right">
                            {field.price_per_minute
                              ? parseFloat(
                                  field.price_per_minute
                                ).toLocaleString("vi-VN")
                              : "N/A"}
                          </td>
                          <td data-label="Giá/Giờ" className="text-right">
                            {field.price_per_minute
                              ? (
                                  parseFloat(field.price_per_minute) * 60
                                ).toLocaleString("vi-VN")
                              : "N/A"}
                          </td>
                          <td data-label="Loại Sân">{field.type}</td>
                          <td data-label="Mô Tả">{field.description}</td>
                          <td data-label="Trạng Thái">{field.status}</td>
                          <td data-label="Hình Ảnh">
                            {field.image ? (
                              <img
                                src={field.image}
                                alt={field.field_name}
                                className="field-image"
                              />
                            ) : (
                              "Chưa có"
                            )}
                          </td>
                          <td data-label="Ngày Tạo">
                            {this.formatDate(field.created_at)}
                          </td>
                          <td data-label="Thao Tác">
                            <div className="btn-action-group">
                              <button
                                className="btn btn-edit"
                                title="Sửa thông tin sân"
                                onClick={() => this.handleEditField(field)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-delete"
                                title="Xóa sân"
                                onClick={() => this.handleDeleteField(field)}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center p-20">
                          Không có sân bóng nào để hiển thị.
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

export default FieldManage;
