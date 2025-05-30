import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../utils/emitter";

class ModalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      address: "",
      phone: "",
    };

    this.listenToEmitter();
  }

  listenToEmitter() {
    emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
      this.setState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        address: "",
        phone: "",
      });
    });
  }

  componentDidMount() {
    console.log("mounting");
  }

  toggle = () => {
    this.props.toggleFromParent();
  };

  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;

    this.setState(
      {
        ...copyState,
      },
      () => {
        console.log(this.state);
      }
    );
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrInput = [
      "email",
      "password",
      "first_name",
      "last_name",
      "address",
      "phone",
    ];

    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        alert("Vui lòng điền đầy đủ thông tin: " + arrInput[i]);
        return isValid;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.state.email && !emailRegex.test(this.state.email)) {
      isValid = false;
      alert("Email không đúng định dạng. Vui lòng nhập lại!");
      return isValid;
    }

    const phoneRegex = /^\d{10,11}$/;
    if (this.state.phone && !phoneRegex.test(this.state.phone)) {
      isValid = false;
      alert("Số điện thoại không hợp lệ. Vui lòng nhập 10 hoặc 11 chữ số!");
      return isValid;
    }

    return isValid;
  };

  handleAddNewUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      const roleId = this.props.roleIdToAssign || "3";
      const dataToSend = {
        ...this.state,
        role_id: roleId,
      };
      this.props.createNewUser(dataToSend);
    }
    console.log("data", this.state);
  };

  render() {
    console.log("check child prop", this.props);
    console.log("check child open modal", this.props.isOpen);
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={() => {
          this.toggle();
        }}
        className={"modal-user-container"}
        size="lg"
        centered
      >
        <ModalHeader
          toggle={() => {
            this.toggle();
          }}
        >
          Thêm người dùng
        </ModalHeader>
        <ModalBody>
          <div className="modal-user-body">
            <div className="input-container">
              <label>Email</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "email");
                }}
                value={this.state.email}
              />
            </div>
            <div className="input-container">
              <label>Mật khẩu</label>
              <input
                type="password"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "password");
                }}
                value={this.state.password}
              />
            </div>
            <div className="input-container">
              <label>Họ đệm</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "first_name");
                }}
                value={this.state.first_name}
              />
            </div>
            <div className="input-container">
              <label>Tên</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "last_name");
                }}
                value={this.state.last_name}
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
              <label>Số điện thoại</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "phone");
                }}
                value={this.state.phone}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="px-3"
            onClick={() => {
              this.handleAddNewUser();
            }}
          >
            Thêm mới
          </Button>{" "}
          <Button
            color="secondary"
            className="px-3"
            onClick={() => {
              this.toggle();
            }}
          >
            Đóng
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
