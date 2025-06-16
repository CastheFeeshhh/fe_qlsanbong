import React, { Component } from "react";
import { toast } from "react-toastify";
import {
  getAllAssetInvoices,
  createAssetInvoice,
  getAssetInvoiceById,
} from "../../services/manageService";
import AddAssetInvoiceModal from "../../component/AddAssetInvoiceModal";
import AssetInvoiceDetailModal from "../../component/AssetInvoiceDetailModal";
import "../../styles/assetInvoiceManage.scss";

class AssetInvoiceManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoices: [],
      isLoading: true,
      error: null,
      isOpenCreateModal: false,
      isOpenDetailModal: false,
      selectedInvoice: null,
    };

    this.dateFormatter = new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    this.currencyFormatter = new Intl.NumberFormat("vi-VN");
  }

  async componentDidMount() {
    await this.loadInvoices();
  }

  loadInvoices = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      let response = await getAllAssetInvoices();
      if (response && response.errCode === 0) {
        this.setState({
          invoices: response.invoices || [],
          isLoading: false,
        });
      } else {
        throw new Error(response?.errMessage || "Dữ liệu không hợp lệ.");
      }
    } catch (e) {
      let errorMessage = "Có lỗi xảy ra khi tải danh sách hóa đơn nhập hàng.";
      this.setState({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  };

  handleOpenCreateModal = () => {
    this.setState({ isOpenCreateModal: true });
  };

  toggleCreateModal = () => {
    this.setState({ isOpenCreateModal: !this.state.isOpenCreateModal });
  };

  doCreateInvoice = async (data) => {
    try {
      let response = await createAssetInvoice(data);
      if (response && response.errCode === 0) {
        toast.success("Tạo phiếu nhập hàng thành công!");
        this.setState({ isOpenCreateModal: false });
        await this.loadInvoices();
      } else {
        toast.error(response.errMessage || "Tạo phiếu nhập hàng thất bại!");
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  handleViewDetails = async (invoice) => {
    this.setState({ isLoading: true });
    try {
      let response = await getAssetInvoiceById(invoice.asset_invoice_id);
      if (response && response.errCode === 0) {
        this.setState({
          selectedInvoice: response.data,
          isOpenDetailModal: true,
        });
      } else {
        toast.error("Không thể lấy chi tiết hóa đơn!");
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra khi lấy chi tiết hóa đơn!");
    }
    this.setState({ isLoading: false });
  };

  toggleDetailModal = () => {
    this.setState({ isOpenDetailModal: !this.state.isOpenDetailModal });
  };

  formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return this.dateFormatter.format(new Date(dateString));
    } catch (error) {
      return dateString;
    }
  };

  formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(parseFloat(amount)))
      return "N/A";
    return this.currencyFormatter.format(parseFloat(amount)) + " VNĐ";
  };

  render() {
    const {
      invoices,
      isLoading,
      error,
      isOpenCreateModal,
      isOpenDetailModal,
      selectedInvoice,
    } = this.state;

    if (isLoading) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ HÓA ĐƠN NHẬP HÀNG</h1>
          <div className="loading-state">{/*...*/}</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ HÓA ĐƠN NHẬP HÀNG</h1>
          <div className="error-state">{/*...*/}</div>
        </div>
      );
    }

    return (
      <div className="system-main-content">
        <h1 className="title">QUẢN LÝ HÓA ĐƠN NHẬP HÀNG</h1>

        <AddAssetInvoiceModal
          isOpen={isOpenCreateModal}
          toggleFromParent={this.toggleCreateModal}
          createInvoice={this.doCreateInvoice}
        />

        <AssetInvoiceDetailModal
          isOpen={isOpenDetailModal}
          toggleFromParent={this.toggleDetailModal}
          invoiceData={selectedInvoice}
        />

        <div className="admin-card">
          <div className="card-header">
            <h3>Danh sách hóa đơn nhập hàng</h3>
            <button
              className="btn btn-primary"
              onClick={this.handleOpenCreateModal}
            >
              <i className="fas fa-plus"></i> Tạo phiếu nhập hàng
            </button>
          </div>
          <div className="card-body">
            <div className="user-role-group">
              <h4 className="role-group-title">
                Tất cả hóa đơn - {invoices.length}
              </h4>

              <div className="table-responsive">
                <table id="asset-invoices-table" className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID HĐ</th>
                      <th>Nhà Cung Cấp</th>
                      <th>Ngày Nhập</th>
                      <th className="text-right">Tổng Tiền</th>
                      <th>Chi Tiết Hàng Hóa</th>
                      <th>Ghi Chú</th>
                      <th className="text-center">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices && invoices.length > 0 ? (
                      invoices.map((invoice) => (
                        <tr key={invoice.asset_invoice_id}>
                          <td>{invoice.asset_invoice_id}</td>
                          <td>{invoice.supplier_name}</td>
                          <td>{this.formatDate(invoice.invoice_date)}</td>
                          <td className="text-right">
                            {this.formatCurrency(invoice.total_amount)}
                          </td>
                          <td>{invoice.details}</td>
                          <td>{invoice.note || ""}</td>
                          <td>
                            <div className="btn-action-group">
                              <button
                                className="btn btn-edit"
                                title="Xem chi tiết hóa đơn"
                                onClick={() => this.handleViewDetails(invoice)}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center p-20">
                          Không có hóa đơn nào.
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

export default AssetInvoiceManage;
