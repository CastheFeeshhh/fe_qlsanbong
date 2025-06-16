import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

class MatchDetailModal extends Component {
  toggle = () => {
    this.props.toggle();
  };

  render() {
    const { isOpen, matchData } = this.props;

    if (!matchData) {
      return null;
    }

    return (
      <Modal isOpen={isOpen} toggle={this.toggle} centered size="md">
        <ModalHeader toggle={this.toggle}>
          Chi tiết trận đấu: {matchData.team_name}
        </ModalHeader>
        <ModalBody>
          <div className="match-detail-content">
            <p>
              <strong>Sân:</strong> {matchData.field_name}
            </p>
            <p>
              <strong>Thời gian:</strong> {matchData.start_time} -{" "}
              {matchData.end_time}
            </p>
            <p>
              <strong>Đội trưởng:</strong>{" "}
              {matchData.captain_name || "Không có"}
            </p>
            <hr />
            <h6>Các dịch vụ đã đặt:</h6>
            {matchData.services && matchData.services.length > 0 ? (
              <ul className="service-list-modal">
                {matchData.services.map((service, index) => (
                  <li key={index}>
                    {service.name} - <strong>SL: {service.quantity}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Không có dịch vụ nào.</p>
            )}
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

export default MatchDetailModal;
