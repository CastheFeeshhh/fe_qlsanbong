import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import _ from "lodash";

class EditAssetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      asset_id: "",
      name: "",
      description: "",
      status: "",
      is_trackable: 0,
      total_quantity: "",
    };
  }

  componentDidMount() {
    let asset = this.props.currentAsset;
    if (asset && !_.isEmpty(asset)) {
      this.setState({
        asset_id: asset.asset_id,
        name: asset.name,
        description: asset.description,
        status: asset.status,
        is_trackable: asset.is_trackable,
        total_quantity: asset.total_quantity,
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

  handleSaveAsset = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      this.props.editAsset(this.state);
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
        <ModalHeader toggle={this.toggle}>Sửa thông tin tài sản</ModalHeader>
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
                checked={
                  this.state.is_trackable === 1 ||
                  this.state.is_trackable === true
                }
              />
              <span className="checkbox-label">
                (Đánh dấu nếu là vật tư tiêu hao)
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
            color="warning"
            className="px-3"
            onClick={this.handleSaveAsset}
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

export default EditAssetModal;
