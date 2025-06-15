import React, { Component } from "react";
import moment from "moment";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getBookingScheduleByDate } from "../services/bookingService";
import { toast } from "react-toastify";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import "../styles/bookingSchedule.scss";
import "moment/locale/vi";
moment.locale("vi");

const timelineKeys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start_time",
  itemTimeEndKey: "end_time",
};

class BookingSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      items: [],
      isLoading: false,
      selectedDate: moment().startOf("day").toDate(),
    };
  }

  async componentDidMount() {
    await this.fetchScheduleData();
  }

  fetchScheduleData = async () => {
    this.setState({ isLoading: true });
    try {
      const { selectedDate } = this.state;
      const formattedDate = moment(selectedDate).format("MM-DD-YYYY");
      let response = await getBookingScheduleByDate(formattedDate);
      if (response && response.errCode === 0 && response.data) {
        this.setState({
          groups: response.data.groups || [],
          items: response.data.items || [],
          isLoading: false,
        });
      } else {
        toast.error("Lấy dữ liệu lịch đặt thất bại!");
        this.setState({ isLoading: false, groups: [], items: [] });
      }
    } catch (e) {
      this.setState({ isLoading: false, groups: [], items: [] });
      toast.error("Có lỗi xảy ra khi gọi API!");
    }
  };

  handleDateChange = (date) => {
    this.setState({ selectedDate: date }, () => {
      this.fetchScheduleData();
    });
  };

  handleQuickFilterClick = (filter) => {
    let newDate;
    if (filter === "today") {
      newDate = moment().startOf("day");
    } else {
      newDate = moment(this.state.selectedDate);
      if (filter === "nextDay") {
        newDate.add(1, "days");
      } else if (filter === "prevDay") {
        newDate.subtract(1, "days");
      }
    }
    this.setState({ selectedDate: newDate.toDate() }, () => {
      this.fetchScheduleData();
    });
  };

  itemRenderer = ({ item, getItemProps }) => {
    const startTime = moment(item.start_time).format("HH:mm DD/MM/YYYY");
    const endTime = moment(item.end_time).format("HH:mm DD/MM/YYYY");

    const tooltipText = `Đội: ${item.title}\nĐội trưởng: ${
      item.captain_name || "N/A"
    }\nTừ: ${startTime}\nĐến: ${endTime}`;

    const itemProps = getItemProps({
      title: tooltipText,
    });

    return (
      <div {...itemProps}>
        <div className="rct-item-content">{item.title}</div>
      </div>
    );
  };

  render() {
    const { groups, items, isLoading, selectedDate } = this.state;
    const visibleTimeStart = moment(selectedDate)
      .startOf("day")
      .add(6, "hours")
      .valueOf();
    const visibleTimeEnd = moment(selectedDate)
      .startOf("day")
      .add(22, "hours")
      .valueOf();

    return (
      <React.Fragment>
        <HomeHeader />
        <div className="page-container">
          <div className="schedule-container-parent">
            <h1 className="title-page">Lịch Đặt Sân</h1>
            <div className="schedule-filters">
              <div className="date-navigation">
                <button
                  className="btn btn-light"
                  onClick={() => this.handleQuickFilterClick("prevDay")}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <DatePicker
                  selected={selectedDate}
                  onChange={this.handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="form-control date-picker-input"
                  maxDate={moment().add(3, "months").toDate()}
                />
                <button
                  className="btn btn-light"
                  onClick={() => this.handleQuickFilterClick("nextDay")}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              <button
                className="btn btn-outline-primary"
                onClick={() => this.handleQuickFilterClick("today")}
              >
                Hôm nay
              </button>
            </div>
            {isLoading ? (
              <div className="loading-state-chart">
                <i className="fas fa-spinner fa-spin"></i> Đang tải lịch...
              </div>
            ) : (
              <div className="timeline-wrapper">
                {groups && groups.length > 0 ? (
                  <>
                    <Timeline
                      groups={groups}
                      items={items}
                      keys={timelineKeys}
                      sidebarWidth={120}
                      lineHeight={50}
                      itemHeightRatio={0.8}
                      canMove={false}
                      canResize={false}
                      visibleTimeStart={visibleTimeStart}
                      visibleTimeEnd={visibleTimeEnd}
                      itemRenderer={this.itemRenderer}
                    />

                    {/* Div test tooltip */}
                    <div
                      title="Test tooltip hiển thị không?"
                      style={{
                        width: "150px",
                        height: "50px",
                        background: "red",
                        marginTop: "20px",
                        textAlign: "center",
                        lineHeight: "50px",
                        color: "white",
                        cursor: "help",
                      }}
                    >
                      Hover tôi
                    </div>
                  </>
                ) : (
                  <div className="loading-state-chart">
                    <p>Không có sân nào để hiển thị.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <HomeFooter />
      </React.Fragment>
    );
  }
}

export default BookingSchedule;
