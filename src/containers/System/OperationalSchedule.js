import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getOperationalSchedule } from "../../services/bookingService";
import { toast } from "react-toastify";
import MatchDetailModal from "../../component/MatchDetailModal";
import "../../styles/operationalSchedule.scss";
import "moment/locale/vi";
moment.locale("vi");

class OperationalSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleData: [],
      isLoading: false,
      selectedDate: moment().startOf("day").toDate(),
      isModalOpen: false,
      selectedMatch: null,
    };
    this.timeSlotRefs = {};
  }

  async componentDidMount() {
    await this.fetchScheduleData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoading === false && prevState.isLoading === true) {
      this.scrollToCurrentTimeSlot();
    }
  }

  fetchScheduleData = async () => {
    this.setState({ isLoading: true });
    try {
      const { selectedDate } = this.state;
      const formattedDate = moment(selectedDate).format("MM-DD-YYYY");
      let response = await getOperationalSchedule(formattedDate);
      if (response && response.errCode === 0 && Array.isArray(response.data)) {
        this.setState({
          scheduleData: response.data,
          isLoading: false,
        });
      } else {
        this.setState({ isLoading: false, scheduleData: [] });
        toast.error("Lấy dữ liệu lịch vận hành thất bại!");
      }
    } catch (e) {
      this.setState({ isLoading: false, scheduleData: [] });
      toast.error("Có lỗi xảy ra khi gọi API!");
    }
  };

  handleDateChange = (date) => {
    this.setState({ selectedDate: date }, () => {
      this.fetchScheduleData();
    });
  };

  handleDateNavigation = (direction) => {
    let newDate;
    if (direction === "today") {
      newDate = moment().startOf("day");
    } else {
      newDate = moment(this.state.selectedDate);
      if (direction === "next") {
        newDate.add(1, "days");
      } else if (direction === "prev") {
        newDate.subtract(1, "days");
      }
    }
    this.setState({ selectedDate: newDate.toDate() }, () => {
      this.fetchScheduleData();
    });
  };

  scrollToCurrentTimeSlot = () => {
    const now = moment();
    if (!moment(this.state.selectedDate).isSame(now, "day")) {
      return;
    }
    const currentTime = now.format("HH:mm");
    let targetSlot = null;
    for (const slot of this.state.scheduleData) {
      if (slot.time_slot >= currentTime) {
        targetSlot = slot.time_slot;
        break;
      }
    }
    if (targetSlot && this.timeSlotRefs[targetSlot]) {
      this.timeSlotRefs[targetSlot].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  openMatchModal = (match) => {
    this.setState({
      isModalOpen: true,
      selectedMatch: match,
    });
  };

  closeMatchModal = () => {
    this.setState({
      isModalOpen: false,
      selectedMatch: null,
    });
  };

  getMatchStatus = (startTime, endTime) => {
    const now = moment();
    const start = moment(startTime, "HH:mm");
    const end = moment(endTime, "HH:mm");
    if (now.isAfter(end)) return "past";
    if (now.isBetween(start, end)) return "ongoing";
    return "upcoming";
  };

  renderMatchCard = (match, type) => {
    const key = `${match.field_name}-${match.team_name}-${match.start_time}`;
    let statusClass = "";
    if (moment(this.state.selectedDate).isSame(moment(), "day")) {
      statusClass = this.getMatchStatus(match.start_time, match.end_time);
    }
    return (
      <div
        className={`match-card ${type} ${statusClass}`}
        key={key}
        onClick={() => this.openMatchModal(match)}
      >
        <div className="match-card-header">
          <span className="field-name">{match.field_name}</span>
          <span className="time-range">
            {match.start_time} - {match.end_time}
          </span>
        </div>
        <div className="match-card-body">
          <p className="team-name">{match.team_name}</p>
          <p className="captain-name">
            <i className="fas fa-user"></i> {match.captain_name}
          </p>
          {match.services && match.services.length > 0 && (
            <p className="services-info">
              <i className="fas fa-concierge-bell"></i> Có{" "}
              {match.services.length} dịch vụ đi kèm
            </p>
          )}
        </div>
      </div>
    );
  };

  render() {
    const {
      scheduleData,
      isLoading,
      selectedDate,
      isModalOpen,
      selectedMatch,
    } = this.state;

    return (
      <div className="system-main-content">
        <h1 className="title">Quản lý lịch sân bóng</h1>
        <MatchDetailModal
          isOpen={isModalOpen}
          toggle={this.closeMatchModal}
          matchData={selectedMatch}
        />
        <div className="operational-schedule-container">
          <div className="schedule-filters">
            <div className="date-navigation">
              <button
                className="btn btn-light"
                onClick={() => this.handleDateNavigation("prev")}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <DatePicker
                selected={selectedDate}
                onChange={this.handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="form-control date-picker-input"
              />
              <button
                className="btn btn-light"
                onClick={() => this.handleDateNavigation("next")}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <button
              className="btn btn-outline-primary"
              onClick={() => this.handleDateNavigation("today")}
            >
              Hôm nay
            </button>
          </div>

          {isLoading ? (
            <div className="loading-state-chart">
              <i className="fas fa-spinner fa-spin"></i> Đang tải lịch...
            </div>
          ) : (
            <div className="schedule-timeline">
              {scheduleData && scheduleData.length > 0 ? (
                scheduleData.map((slot) => (
                  <div
                    className="time-slot-block"
                    key={slot.time_slot}
                    ref={(el) => (this.timeSlotRefs[slot.time_slot] = el)}
                  >
                    <div className="time-slot-header">{slot.time_slot}</div>
                    <div className="matches-container">
                      <div className="matches-column">
                        <h4>Trận Bắt Đầu</h4>
                        <div className="matches-list">
                          {slot.starting_matches.length > 0 ? (
                            slot.starting_matches.map((match) =>
                              this.renderMatchCard(match, "starting")
                            )
                          ) : (
                            <p className="no-match">Không có</p>
                          )}
                        </div>
                      </div>
                      <div className="matches-column">
                        <h4>Trận Kết Thúc</h4>
                        <div className="matches-list">
                          {slot.ending_matches.length > 0 ? (
                            slot.ending_matches.map((match) =>
                              this.renderMatchCard(match, "ending")
                            )
                          ) : (
                            <p className="no-match">Không có</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="loading-state-chart">
                  <p>Không có lịch đặt nào trong ngày này.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OperationalSchedule);
