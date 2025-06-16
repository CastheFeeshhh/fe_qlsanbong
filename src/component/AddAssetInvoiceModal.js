import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllSuppliers, getAllAssets } from "../services/manageService";
import "../styles/addAssetInvoiceModal.scss";

class AddAssetInvoiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suppliers: [],
      assets: [],
      supplier_id: "",
      invoice_date: new Date(),
      note: "",
      details: [{ asset_id: "", quantity: 1, price: "" }],
    };
  }

  async componentDidMount() {
    try {
      const [suppliersRes, assetsRes] = await Promise.all([
        getAllSuppliers(),
        getAllAssets(),
      ]);

      if (suppliersRes && suppliersRes.errCode === 0) {
        this.setState({ suppliers: suppliersRes.suppliers || [] });
      }
      if (assetsRes && assetsRes.errCode === 0) {
        this.setState({ assets: assetsRes.assets || [] });
      }
    } catch (e) {
      toast.error("Không thể tải dữ liệu nhà cung cấp hoặc tài sản!");
    }
  }

  toggle = () => {
    this.props.toggleFromParent();
  };

  handleOnChangeInput = (event, field) => {
    this.setState({
      [field]: event.target.value,
    });
  };

  handleDateChange = (date) => {
    this.setState({
      invoice_date: date,
    });
  };

  handleDetailChange = (index, event) => {
    let details = [...this.state.details];
    details[index][event.target.name] = event.target.value;
    this.setState({ details });
  };

  addDetailRow = () => {
    this.setState((prevState) => ({
      details: [...prevState.details, { asset_id: "", quantity: 1, price: "" }],
    }));
  };

  removeDetailRow = (index) => {
    let details = [...this.state.details];
    details.splice(index, 1);
    this.setState({ details });
  };

  checkValidateInput = () => {
    if (!this.state.supplier_id) {
      toast.error("Vui lòng chọn nhà cung cấp!");
      return false;
    }
    if (this.state.details.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm!");
      return false;
    }
    for (const detail of this.state.details) {
      if (
        !detail.asset_id ||
        !detail.quantity ||
        !detail.price ||
        detail.quantity <= 0 ||
        detail.price < 0
      ) {
        toast.error(
          "Vui lòng điền đầy đủ và chính xác thông tin cho tất cả các dòng sản phẩm!"
        );
        return false;
      }
    }
    return true;
  };

  handleCreateInvoice = () => {
    if (this.checkValidateInput()) {
      const { supplier_id, invoice_date, note, details } = this.state;

      const dataToSubmit = {
        supplier_id,
        invoice_date: moment(invoice_date).format("MM-DD-YYYY"),
        note,
        details,
      };
      this.props.createInvoice(dataToSubmit);
    }
  };

  render() {
    const { suppliers, assets, details, supplier_id, invoice_date, note } =
      this.state;

    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.toggle}
        size="lg"
        className="modal-user-container"
      >
        <ModalHeader toggle={this.toggle}>Tạo Phiếu Nhập Hàng</ModalHeader>
        <ModalBody>
          <div className="add-invoice-container">
            <div className="row">
              <div className="col-6 form-group">
                <label>Nhà cung cấp</label>
                <select
                  className="form-control"
                  value={supplier_id}
                  onChange={(e) => this.handleOnChangeInput(e, "supplier_id")}
                >
                  <option value="">-- Chọn nhà cung cấp --</option>
                  {suppliers.map((supplier) => (
                    <option
                      key={supplier.supplier_id}
                      value={supplier.supplier_id}
                    >
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6 form-group">
                <label>Ngày nhập</label>
                <DatePicker
                  selected={invoice_date}
                  onChange={this.handleDateChange}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 form-group">
                <label>Ghi chú</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={note}
                  onChange={(e) => this.handleOnChangeInput(e, "note")}
                ></textarea>
              </div>
            </div>

            <hr />
            <h6>Chi tiết hàng hóa</h6>
            {details.map((detail, index) => (
              <div className="row detail-row" key={index}>
                <div className="col-5 form-group">
                  <select
                    name="asset_id"
                    className="form-control"
                    value={detail.asset_id}
                    onChange={(e) => this.handleDetailChange(index, e)}
                  >
                    <option value="">-- Chọn tài sản --</option>
                    {assets.map((asset) => (
                      <option key={asset.asset_id} value={asset.asset_id}>
                        {asset.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-3 form-group">
                  <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    placeholder="Số lượng"
                    value={detail.quantity}
                    onChange={(e) => this.handleDetailChange(index, e)}
                  />
                </div>
                <div className="col-3 form-group">
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    placeholder="Đơn giá"
                    value={detail.price}
                    onChange={(e) => this.handleDetailChange(index, e)}
                  />
                </div>
                <div className="col-1">
                  <button
                    className="btn btn-danger"
                    onClick={() => this.removeDetailRow(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
            <button
              className="btn btn-add-row  mt-2"
              onClick={this.addDetailRow}
            >
              <i className="fas fa-plus"></i> Thêm dòng
            </button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleCreateInvoice}>
            Lưu
          </Button>
          <Button color="secondary" onClick={this.toggle}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AddAssetInvoiceModal;
