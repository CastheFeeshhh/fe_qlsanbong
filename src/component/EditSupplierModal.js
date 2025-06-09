import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import _ from "lodash";

class EditSupplierModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supplier_id: "",
      name: "",
      phone: "",
      address: "",
      description: "",
    };
  }

  componentDidMount() {
    let supplier = this.props.currentSupplier;
    if (supplier && !_.isEmpty(supplier)) {
      this.setState({
        supplier_id: supplier.supplier_id,
        name: supplier.name,
        phone: supplier.phone,
        address: supplier.address,
        description: supplier.description,
      });
    }
  }

  toggle = () => {
    this.props.toggleFromParent();
  };

  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrInput = ["name", "phone"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        toast.error("Thiếu trường bắt buộc: " + arrInput[i]);
        break;
      }
    }
    return isValid;
  };

  handleSaveSupplier = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      this.props.editSupplier(this.state);
    }
  };

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.toggle}
        className={"modal-user-container"}
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>
          Sửa thông tin nhà cung cấp
        </ModalHeader>
        <ModalBody>
          <div className="modal-user-body">
            <div className="input-container">
              <label>Tên nhà cung cấp</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "name");
                }}
                value={this.state.name}
              />
            </div>
            <div className="input-container">
              <label>Số điện thoại</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "phone");
                }}
                value={this.state.phone}
              />
            </div>
            <div className="input-container max-width-input">
              <label>Địa chỉ</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "address");
                }}
                value={this.state.address}
              />
            </div>
            <div className="input-container max-width-input">
              <label>Mô tả</label>
              <textarea
                rows="3"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "description");
                }}
                value={this.state.description}
              ></textarea>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="warning"
            className="px-3"
            onClick={this.handleSaveSupplier}
          >
            Lưu thay đổi
          </Button>
          <Button color="secondary" className="px-3" onClick={this.toggle}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default EditSupplierModal;
