import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";
import "../styles/assetInvoiceDetailModal.scss";
import "moment/locale/vi";
moment.locale("vi");

class AssetInvoiceDetailModal extends Component {
  constructor(props) {
    super(props);
    this.currencyFormatter = new Intl.NumberFormat("vi-VN");
  }

  toggle = () => {
    this.props.toggleFromParent();
  };

  formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(parseFloat(amount)))
      return "0";
    return this.currencyFormatter.format(parseFloat(amount));
  };

  render() {
    const { isOpen, invoiceData } = this.props;

    if (!invoiceData) {
      return null;
    }

    const details = invoiceData.AssetInvoiceDetails || [];

    return (
      <Modal
        isOpen={isOpen}
        toggle={this.toggle}
        centered
        size="lg"
        className="modal-user-container"
      >
        <ModalHeader toggle={this.toggle}>
          Chi tiết hóa đơn nhập hàng #{invoiceData.asset_invoice_id}
        </ModalHeader>
        <ModalBody>
          <div className="customer-info-section">
            <p>
              <strong>Nhà cung cấp:</strong> {invoiceData.Supplier?.name}
            </p>
            <p>
              <strong>Ngày nhập:</strong>{" "}
              {moment(invoiceData.invoice_date).format("DD/MM/YYYY")}
            </p>
          </div>
          <hr />
          <div className="items-section">
            <h6>Danh sách hạng mục</h6>
            {details.map((item, index) => (
              <div className="item-row" key={index}>
                <span>{item.Asset?.name}</span>
                <span>(Số lượng: {item.quantity})</span>
              </div>
            ))}
          </div>
          <hr />
          <div className="summary-section">
            <div className="total-amount">
              <span>Tổng cộng:</span>
              <strong>
                {this.formatCurrency(invoiceData.total_amount)} VNĐ
              </strong>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.toggle}>
            Đóng
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AssetInvoiceDetailModal;
