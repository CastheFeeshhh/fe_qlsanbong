import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";

class AddFieldModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field_name: "",
      price_per_minute: "",
      type: "Sân 5",
      description: "",
      status: "Trống",
      image: "",
    };
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
    let arrInput = ["field_name", "price_per_minute", "type"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        toast.error("Thiếu trường bắt buộc: " + arrInput[i]);
        break;
      }
    }
    return isValid;
  };

  handleAddNewField = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      this.props.createNewField(this.state);
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
        <ModalHeader toggle={this.toggle}>Thêm sân bóng mới</ModalHeader>
        <ModalBody>
          <div className="modal-user-body">
            <div className="input-container">
              <label>Tên sân</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "field_name");
                }}
                value={this.state.field_name}
              />
            </div>
            <div className="input-container">
              <label>Giá / phút (VNĐ)</label>
              <input
                type="text"
                className="form-control"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "price_per_minute");
                }}
                value={this.state.price_per_minute}
              />
            </div>
            <div className="input-container">
              <label>Loại sân</label>
              <select
                className="form-control"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "type");
                }}
                value={this.state.type}
              >
                <option value="Sân 5">Sân 5</option>
                <option value="Sân 7">Sân 7</option>
                <option value="Sân 9">Sân 9</option>
              </select>
            </div>
            <div className="input-container">
              <label>Trạng thái</label>
              <select
                className="form-control"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "status");
                }}
                value={this.state.status}
              >
                <option value="Trống">Trống</option>
                <option value="Đang bảo trì">Đang bảo trì</option>
                <option value="Không khả dụng">Không khả dụng</option>
              </select>
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
            <div className="input-container max-width-input">
              <label>Link hình ảnh</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "image");
                }}
                value={this.state.image}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="px-3"
            onClick={this.handleAddNewField}
          >
            Thêm mới
          </Button>
          <Button color="secondary" className="px-3" onClick={this.toggle}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AddFieldModal;
