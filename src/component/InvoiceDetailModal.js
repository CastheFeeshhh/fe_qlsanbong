import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";
import "../styles/invoiceDetailModal.scss";

class InvoiceDetailModal extends Component {
  toggle = () => {
    this.props.toggleFromParent();
  };

  formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    return moment(dateString).format("HH:mm, DD/MM/YYYY");
  };

  formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return moment(timeString, "HH:mm:ss").format("HH:mm");
  };

  formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "0 VNĐ";
    return parseFloat(amount).toLocaleString("vi-VN") + " VNĐ";
  };

  render() {
    const { isOpen, invoiceData } = this.props;
    const details = invoiceData?.details;

    return (
      <Modal
        isOpen={isOpen}
        toggle={this.toggle}
        className={"modal-invoice-detail"}
        size="lg"
        centered
      >
        <ModalHeader toggle={this.toggle}>
          <i
            className="fas fa-file-invoice-dollar"
            style={{ marginRight: "10px" }}
          ></i>
          Chi tiết hóa đơn #{invoiceData?.invoice_id}
        </ModalHeader>
        <ModalBody>
          <div className="invoice-document">
            <div className="invoice-customer-info">
              <p>
                <strong>Khách hàng:</strong> {invoiceData?.customer_name}
              </p>
              <p>
                <strong>Email:</strong> {invoiceData?.customer_email}
              </p>
              <p>
                <strong>Ngày thanh toán:</strong>{" "}
                {this.formatDate(invoiceData?.paid_at)}
              </p>
            </div>

            <div className="invoice-items-section">
              <h6>Danh sách hạng mục</h6>
              <ul className="line-items-list">
                {details?.FieldBookingDetail?.map((item, index) => (
                  <li key={`field-${index}`}>
                    Sân:{" "}
                    <strong>
                      {item.Field?.field_name} ({item.Field?.type})
                    </strong>{" "}
                    | {moment(item.date).format("DD/MM/YYYY")} |{" "}
                    {this.formatTime(item.start_time)} -{" "}
                    {this.formatTime(item.end_time)}
                  </li>
                ))}
                {details?.FieldBookingDetail?.flatMap((detail) =>
                  detail.ServiceBookings?.flatMap((sb) =>
                    sb.ServiceBookingDetails?.map((sbd, index) => (
                      <li key={`service-${index}`}>
                        Dịch vụ: <strong>{sbd.Service?.name}</strong> (Số lượng:{" "}
                        {sbd.quantity})
                      </li>
                    ))
                  )
                )}
              </ul>
            </div>

            <div className="invoice-summary-section">
              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span>{this.formatCurrency(invoiceData?.total_price)}</span>
              </div>
            </div>
            <div className="invoice-footer">
              <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.toggle}>
            Đóng
          </Button>
          <Button color="primary" onClick={() => window.print()}>
            <i className="fas fa-print" style={{ marginRight: "5px" }}></i> In
            hóa đơn
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default InvoiceDetailModal;
