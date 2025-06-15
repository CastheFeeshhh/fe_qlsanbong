import React, { Component } from "react";
import { toast } from "react-toastify";
import {
  getAllSuppliers,
  createNewSupplierService,
  deleteSupplierService,
  editSupplierService,
} from "../../services/manageService";
import "../../styles/supplierManage.scss";
import AddSupplierModal from "../../component/AddSupplierModal";
import EditSupplierModal from "../../component/EditSupplierModal";

class SupplierManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suppliers: [],
      isLoading: true,
      error: null,
      isOpenCreateModal: false,
      isOpenEditModal: false,
      supplierEdit: {},
    };

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    this.dateFormatter = new Intl.DateTimeFormat("vi-VN", options);
  }

  async componentDidMount() {
    await this.loadSuppliers();
  }

  loadSuppliers = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      let response = await getAllSuppliers();
      if (response && response.errCode === 0) {
        this.setState({
          suppliers: response.suppliers || [],
          isLoading: false,
        });
      } else {
        throw new Error(response?.errMessage || "Dữ liệu không hợp lệ.");
      }
    } catch (e) {
      this.setState({
        error: "Có lỗi xảy ra khi tải danh sách.",
        isLoading: false,
      });
      toast.error("Có lỗi xảy ra khi tải danh sách!");
    }
  };

  handleAddNewSupplier = () => {
    this.setState({ isOpenCreateModal: true });
  };

  toggleCreateModal = () => {
    this.setState({ isOpenCreateModal: !this.state.isOpenCreateModal });
  };

  createNewSupplier = async (data) => {
    try {
      let response = await createNewSupplierService(data);
      if (response && response.errCode !== 0) {
        toast.error(response.errMessage);
      } else {
        await this.loadSuppliers();
        this.setState({ isOpenCreateModal: false });
        toast.success("Thêm nhà cung cấp mới thành công!");
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  handleDeleteSupplier = async (supplier) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) {
      try {
        let res = await deleteSupplierService(supplier.supplier_id);
        if (res && res.errCode === 0) {
          await this.loadSuppliers();
          toast.success("Xóa nhà cung cấp thành công!");
        } else {
          toast.error(res.errMessage);
        }
      } catch (e) {
        toast.error("Có lỗi xảy ra!");
      }
    }
  };

  handleEditSupplier = (supplier) => {
    console.log("supplier:", supplier);
    this.setState({
      isOpenEditModal: true,
      supplierEdit: supplier,
    });
  };

  toggleEditModal = () => {
    this.setState({ isOpenEditModal: !this.state.isOpenEditModal });
  };

  doEditSupplier = async (supplier) => {
    try {
      let res = await editSupplierService(supplier);
      if (res && res.errCode === 0) {
        this.setState({ isOpenEditModal: false });
        await this.loadSuppliers();
        toast.success("Cập nhật nhà cung cấp thành công!");
      } else {
        toast.error(res.errMessage);
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return this.dateFormatter.format(new Date(dateString));
    } catch (error) {
      return dateString;
    }
  };

  render() {
    const {
      suppliers,
      isLoading,
      error,
      isOpenCreateModal,
      isOpenEditModal,
      supplierEdit,
    } = this.state;

    if (isLoading) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ NHÀ CUNG CẤP</h1>
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ NHÀ CUNG CẤP</h1>
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i> {error}
          </div>
          <button className="btn btn-primary" onClick={this.loadSuppliers}>
            <i className="fas fa-sync-alt"></i> Thử lại
          </button>
        </div>
      );
    }

    return (
      <div className="system-main-content">
        <h1 className="title">QUẢN LÝ NHÀ CUNG CẤP</h1>
        {isOpenCreateModal && (
          <AddSupplierModal
            isOpen={isOpenCreateModal}
            toggleFromParent={this.toggleCreateModal}
            createNewSupplier={this.createNewSupplier}
          />
        )}
        {isOpenEditModal && (
          <EditSupplierModal
            isOpen={isOpenEditModal}
            toggleFromParent={this.toggleEditModal}
            currentSupplier={supplierEdit}
            editSupplier={this.doEditSupplier}
          />
        )}
        <div className="admin-card">
          <div className="card-header">
            <h3>Danh sách nhà cung cấp</h3>
            <button
              className="btn btn-primary"
              onClick={this.handleAddNewSupplier}
            >
              <i className="fas fa-plus"></i> Thêm nhà cung cấp
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
                                onClick={() =>
                                  this.handleEditSupplier(supplier)
                                }
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-delete"
                                title="Xóa nhà cung cấp"
                                onClick={() =>
                                  this.handleDeleteSupplier(supplier)
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
