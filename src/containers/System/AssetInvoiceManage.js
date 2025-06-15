import React, { Component } from "react";
import { toast } from "react-toastify";
import { getAllAssetInvoices } from "../../services/manageService";
import "../../styles/assetInvoiceManage.scss";

class AssetInvoiceManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoices: [],
      isLoading: true,
      error: null,
    };

    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    this.dateFormatter = new Intl.DateTimeFormat("vi-VN", options);
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

  formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return this.dateFormatter.format(new Date(dateString));
    } catch (error) {
      return dateString;
    }
  };

  render() {
    const { invoices, isLoading, error } = this.state;

    if (isLoading) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ HÓA ĐƠN NHẬP HÀNG</h1>
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ HÓA ĐƠN NHẬP HÀNG</h1>
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i> {error}
          </div>
          <button className="btn btn-primary" onClick={this.loadInvoices}>
            <i className="fas fa-sync-alt"></i> Thử lại
          </button>
        </div>
      );
    }

    return (
      <div className="system-main-content">
        <h1 className="title">QUẢN LÝ HÓA ĐƠN NHẬP HÀNG</h1>
        <div className="admin-card">
          <div className="card-header">
            <h3>Danh sách hóa đơn nhập hàng</h3>
            <button className="btn btn-primary">
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
                          <td data-label="ID HĐ">{invoice.asset_invoice_id}</td>
                          <td data-label="Nhà Cung Cấp">
                            {invoice.supplier_name}
                          </td>
                          <td data-label="Ngày Nhập">
                            {this.formatDate(invoice.invoice_date)}
                          </td>
                          <td data-label="Tổng Tiền" className="text-right">
                            {invoice.total_amount
                              ? parseFloat(invoice.total_amount).toLocaleString(
                                  "vi-VN"
                                ) + " VNĐ"
                              : "N/A"}
                          </td>
                          <td data-label="Chi Tiết Hàng Hóa">
                            {invoice.details}
                          </td>
                          <td data-label="Ghi Chú">{invoice.note || ""}</td>
                          <td data-label="Thao Tác">
                            <div className="btn-action-group">
                              <button
                                className="btn btn-edit"
                                title="Xem chi tiết hóa đơn"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                className="btn btn-delete"
                                title="Xóa hóa đơn"
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
