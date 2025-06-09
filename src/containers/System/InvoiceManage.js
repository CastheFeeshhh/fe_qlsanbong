import React, { Component } from "react";
import { toast } from "react-toastify";
import {
  getAllInvoices,
  getInvoiceDetailsById,
} from "../../services/manageService";
import InvoiceDetailModal from "../../component/InvoiceDetailModal";
import "../../styles/invoiceManage.scss";
import moment from "moment";

class InvoiceManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoices: [],
      isLoading: true,
      error: null,
      isOpenDetailModal: false,
      invoiceDetailData: null,
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
      this.setState({
        error: "Có lỗi xảy ra khi tải danh sách hóa đơn.",
        isLoading: false,
      });
      toast.error("Có lỗi xảy ra khi tải danh sách hóa đơn.");
    }
  };

  formatDate = (dateString) => {
    if (!dateString) return "Chưa thanh toán";
    return moment(dateString).format("HH:mm [ngày] DD/MM/YYYY");
  };

  toggleDetailModal = () => {
    this.setState({ isOpenDetailModal: !this.state.isOpenDetailModal });
  };

  handleViewDetails = async (invoice) => {
    try {
      this.setState({ isLoading: true });
      let response = await getInvoiceDetailsById(invoice.booking_id);
      this.setState({ isLoading: false });

      if (response && response.errCode === 0) {
        const fullInvoiceData = {
          ...invoice,
          details: response.details,
        };
        this.setState({
          invoiceDetailData: fullInvoiceData,
          isOpenDetailModal: true,
        });
      } else {
        toast.error("Không thể lấy chi tiết hóa đơn!");
      }
    } catch (e) {
      this.setState({ isLoading: false });
      toast.error("Có lỗi xảy ra khi lấy chi tiết hóa đơn!");
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
        {this.state.isOpenDetailModal && (
          <InvoiceDetailModal
            isOpen={this.state.isOpenDetailModal}
            toggleFromParent={this.toggleDetailModal}
            invoiceData={this.state.invoiceDetailData}
          />
        )}
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
                          <td>{invoice.invoice_id}</td>
                          <td>{invoice.booking_id}</td>
                          <td>{invoice.customer_name}</td>
                          <td>{invoice.customer_email}</td>
                          <td className="text-right">
                            {parseFloat(invoice.total_price).toLocaleString(
                              "vi-VN"
                            ) + " VNĐ"}
                          </td>
                          <td>{invoice.payment_method}</td>
                          <td>{this.formatDate(invoice.paid_at)}</td>
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
