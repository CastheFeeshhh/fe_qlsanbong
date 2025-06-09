import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import _ from "lodash";

class EditFieldModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field_id: "",
      field_name: "",
      price_per_minute: "",
      type: "",
      description: "",
      status: "",
      image: "",
    };
  }

  componentDidMount() {
    let field = this.props.currentField;
    if (field && !_.isEmpty(field)) {
      this.setState({
        field_id: field.field_id,
        field_name: field.field_name,
        price_per_minute: field.price_per_minute,
        type: field.type,
        description: field.description,
        status: field.status,
        image: field.image,
      });
    }
  }

  toggle = () => {
    this.props.toggleFromParent();
  };

  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({ ...copyState });
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

  handleSaveField = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      this.props.editField(this.state);
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
        <ModalHeader toggle={this.toggle}>Sửa thông tin sân bóng</ModalHeader>
        <ModalBody>
          <div className="modal-user-body">
            <div className="input-container">
              <label>Tên sân</label>
              <input
                type="text"
                onChange={(e) => this.handleOnChangeInput(e, "field_name")}
                value={this.state.field_name}
              />
            </div>
            <div className="input-container">
              <label>Giá / phút (VNĐ)</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) =>
                  this.handleOnChangeInput(e, "price_per_minute")
                }
                value={this.state.price_per_minute}
              />
            </div>
            <div className="input-container">
              <label>Loại sân</label>
              <select
                className="form-control"
                onChange={(e) => this.handleOnChangeInput(e, "type")}
                value={this.state.type}
              >
                <option value="Sân 5">Sân 5</option>
                <option value="Sân 7">Sân 7</option>
                <option value="Sân 9">Sân 9</option>
                <option value="Sân 11">Sân 11</option>
              </select>
            </div>
            <div className="input-container">
              <label>Trạng thái</label>
              <select
                className="form-control"
                onChange={(e) => this.handleOnChangeInput(e, "status")}
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
                onChange={(e) => this.handleOnChangeInput(e, "description")}
                value={this.state.description}
              ></textarea>
            </div>
            <div className="input-container max-width-input">
              <label>Link hình ảnh</label>
              <input
                type="text"
                onChange={(e) => this.handleOnChangeInput(e, "image")}
                value={this.state.image}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="warning"
            className="px-3"
            onClick={this.handleSaveField}
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

export default EditFieldModal;
