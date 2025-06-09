import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import _ from "lodash";

class EditServiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      service_id: "",
      name: "",
      price: "",
      description: "",
      type: "",
      asset_id: "",
    };
  }

  componentDidMount() {
    let service = this.props.currentService;
    if (service && !_.isEmpty(service)) {
      this.setState({
        service_id: service.service_id,
        name: service.name,
        price: service.price,
        description: service.description,
        type: service.type,
        asset_id: service.asset_id || "",
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentService !== prevProps.currentService) {
      let service = this.props.currentService;
      if (service && !_.isEmpty(service)) {
        this.setState({
          service_id: service.service_id,
          name: service.name,
          price: service.price,
          description: service.description,
          type: service.type,
          asset_id: service.asset_id || "",
        });
      }
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
    let arrInput = ["name", "price", "type"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        toast.error("Thiếu trường bắt buộc: " + arrInput[i]);
        break;
      }
    }
    return isValid;
  };

  handleSaveService = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      this.props.editService(this.state);
    }
  };

  render() {
    let assets = this.props.assets;
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.toggle}
        className={"modal-user-container"}
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>Sửa thông tin dịch vụ</ModalHeader>
        <ModalBody>
          <div className="modal-user-body">
            <div className="input-container">
              <label>Tên dịch vụ</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "name");
                }}
                value={this.state.name}
              />
            </div>
            <div className="input-container">
              <label>Giá (VNĐ)</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "price");
                }}
                value={this.state.price}
              />
            </div>
            <div className="input-container">
              <label>Loại hình</label>
              <select
                className="form-control"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "type");
                }}
                value={this.state.type}
              >
                <option value="Mua">Mua</option>
                <option value="Thuê">Thuê</option>
              </select>
            </div>
            <div className="input-container">
              <label>Tài sản liên kết (nếu có)</label>
              <select
                className="form-control"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "asset_id");
                }}
                value={this.state.asset_id}
              >
                <option value="">Không liên kết</option>
                {assets &&
                  assets.length > 0 &&
                  assets.map((item, index) => {
                    return (
                      <option key={index} value={item.asset_id}>
                        {item.name}
                      </option>
                    );
                  })}
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
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="warning"
            className="px-3"
            onClick={this.handleSaveService}
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

export default EditServiceModal;
