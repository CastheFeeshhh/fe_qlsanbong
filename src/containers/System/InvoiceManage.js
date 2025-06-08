import React, { Component } from "react";
import { toast } from "react-toastify";
import { getAllInvoices } from "../../services/userService";
import "../../styles/invoiceManage.scss";

class InvoiceManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoices: [],
      isLoading: true,
      error: null,
    };
  }

  async componentDidMount() {
    await this.loadInvoices();
  }

  loadInvoices = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      let response = await getAllInvoices();
      if (response && response.errCode === 0) {
        this.setState({
          invoices: response.invoices || [],
          isLoading: false,
        });
      } else {
        throw new Error(
          response?.errMessage || "Dữ liệu nhận được không hợp lệ."
        );
      }
    } catch (e) {
      console.error("Lỗi khi tải danh sách hóa đơn:", e);
      let errorMessage = "Có lỗi xảy ra khi tải danh sách hóa đơn.";
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
    if (!dateString) return "Chưa thanh toán";
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
    const { invoices, isLoading, error } = this.state;

    if (isLoading) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ HÓA ĐƠN</h1>
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
          <h1 className="title">QUẢN LÝ HÓA ĐƠN</h1>
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
          <button className="btn btn-primary" onClick={this.loadInvoices}>
            <i className="fas fa-sync-alt"></i>
            Thử lại
          </button>
        </div>
      );
    }

    return (
      <div className="system-main-content">
        <h1 className="title">QUẢN LÝ HÓA ĐƠN</h1>
        <div className="admin-card">
          <div className="card-header">
            <h3>Danh sách hóa đơn</h3>
          </div>
          <div className="card-body">
            <div className="user-role-group">
              <h4 className="role-group-title">
                Tất cả hóa đơn - {invoices.length}
              </h4>
              <div className="table-responsive">
                <table id="invoices-table" className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID HĐ</th>
                      <th>ID Đặt</th>
                      <th>Người Đặt</th>
                      <th>Email</th>
                      <th className="text-right">Tổng Tiền</th>
                      <th>Phương Thức</th>
                      <th>Ngày TT</th>
                      <th className="text-center">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices && invoices.length > 0 ? (
                      invoices.map((invoice) => (
                        <tr key={invoice.invoice_id}>
                          <td data-label="ID Hóa Đơn">{invoice.invoice_id}</td>
                          <td data-label="ID Đơn Đặt">{invoice.booking_id}</td>
                          <td data-label="Khách Hàng">
                            {invoice.customer_name}
                          </td>
                          <td data-label="Email Khách Hàng">
                            {invoice.customer_email}
                          </td>
                          <td data-label="Tổng Tiền" className="text-right">
                            {invoice.total_price
                              ? parseFloat(invoice.total_price).toLocaleString(
                                  "vi-VN"
                                ) + " VNĐ"
                              : "N/A"}
                          </td>
                          <td data-label="Phương Thức TT">
                            {invoice.payment_method}
                          </td>
                          <td data-label="Ngày Thanh Toán">
                            {this.formatDate(invoice.paid_at)}
                          </td>
                          <td data-label="Thao Tác">
                            <div className="btn-action-group">
                              <button
                                className="btn btn-edit"
                                title="Xem chi tiết hóa đơn"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center p-20">
                          Không có hóa đơn nào để hiển thị.
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

export default InvoiceManage;
