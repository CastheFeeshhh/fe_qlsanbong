import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";

class AddAssetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      status: "Có sẵn",
      is_trackable: 0,
      total_quantity: "",
    };
  }

  toggle = () => {
    this.props.toggleFromParent();
  };

  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({ ...copyState });
  };

  handleOnChangeCheckbox = (event) => {
    this.setState({
      is_trackable: event.target.checked ? 1 : 0,
    });
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrInput = ["name", "total_quantity"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        toast.error("Thiếu trường bắt buộc: " + arrInput[i]);
        break;
      }
    }
    return isValid;
  };

  handleAddNewAsset = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      this.props.createNewAsset(this.state);
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
        <ModalHeader toggle={this.toggle}>Thêm tài sản mới</ModalHeader>
        <ModalBody>
          <div className="modal-user-body">
            <div className="input-container">
              <label>Tên tài sản</label>
              <input
                type="text"
                onChange={(e) => this.handleOnChangeInput(e, "name")}
                value={this.state.name}
              />
            </div>
            <div className="input-container">
              <label>Tổng số lượng</label>
              <input
                type="text"
                onChange={(e) => this.handleOnChangeInput(e, "total_quantity")}
                value={this.state.total_quantity}
              />
            </div>
            <div className="input-container">
              <label>Trạng thái</label>
              <select
                className="form-control"
                onChange={(e) => this.handleOnChangeInput(e, "status")}
                value={this.state.status}
              >
                <option value="Có sẵn">Có sẵn</option>
                <option value="Đang sử dụng">Đang sử dụng</option>
                <option value="Đang bảo trì">Đang bảo trì</option>
                <option value="Cần thêm mới">Cần thêm mới</option>
                <option value="Đã bị hỏng">Đã bị hỏng</option>
              </select>
            </div>
            <div className="input-container">
              <label>Theo dõi tồn kho?</label>
              <input
                type="checkbox"
                onChange={this.handleOnChangeCheckbox}
                checked={this.state.is_trackable === 1}
              />
              <span className="checkbox-label">
                (Đánh dấu nếu là vật tư tiêu hao như nước, khăn...)
              </span>
            </div>
            <div className="input-container max-width-input">
              <label>Mô tả</label>
              <textarea
                rows="3"
                onChange={(e) => this.handleOnChangeInput(e, "description")}
                value={this.state.description}
              ></textarea>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="px-3"
            onClick={this.handleAddNewAsset}
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

export default AddAssetModal;
