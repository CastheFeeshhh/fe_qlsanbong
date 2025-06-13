import React, { Component } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { getBookingsStatistics } from "../../services/statisticsService";
import { Pie, Line } from "react-chartjs-2";
import "../../styles/statisticsPage.scss";

class BookingStatsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment().startOf("month").toDate(),
      endDate: moment().endOf("month").toDate(),
      reportData: null,
      isLoading: false,
      activeFilter: "thisMonth",
    };
  }

  async componentDidMount() {
    this.handleQuickFilterClick("thisMonth");
  }

  fetchReportData = async () => {
    this.setState({ isLoading: true });
    try {
      const { startDate, endDate } = this.state;
      const formattedStartDate = moment(startDate).format("MM/DD/YYYY");
      const formattedEndDate = moment(endDate).format("MM/DD/YYYY");
      let response = await getBookingsStatistics(
        formattedStartDate,
        formattedEndDate
      );
      if (response && response.errCode === 0) {
        this.setState({ reportData: response.data, isLoading: false });
      } else {
        toast.error(response.errMessage || "Lấy dữ liệu báo cáo thất bại!");
        this.setState({ isLoading: false, reportData: null });
      }
    } catch (e) {
      this.setState({ isLoading: false });
      toast.error("Có lỗi xảy ra khi gọi API!");
      console.log(e);
    }
  };

  handleQuickFilterClick = (filter) => {
    let startDate, endDate;
    const today = moment();
    switch (filter) {
      case "today":
        startDate = today.clone().startOf("day");
        endDate = today.clone().endOf("day");
        break;
      case "thisWeek":
        startDate = today.clone().startOf("isoWeek");
        endDate = today.clone().endOf("isoWeek");
        break;
      case "thisMonth":
        startDate = today.clone().startOf("month");
        endDate = today.clone().endOf("month");
        break;
      case "thisQuarter":
        startDate = today.clone().startOf("quarter");
        endDate = today.clone().endOf("quarter");
        break;
      case "thisYear":
        startDate = today.clone().startOf("year");
        endDate = today.clone().endOf("year");
        break;
      case "allTime":
        startDate = moment("2020-01-01");
        endDate = today;
        break;
      default:
        this.setState({ activeFilter: "custom" });
        return;
    }
    this.setState(
      {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        activeFilter: filter,
      },
      () => {
        this.fetchReportData();
      }
    );
  };

  handleViewReport = () => {
    this.fetchReportData();
  };

  preparePieChartData = () => {
    const { reportData } = this.state;
    if (!reportData || !reportData.statusStats) return {};
    const colorMap = {
      "Đã xác nhận": {
        background: "rgba(40, 167, 69, 0.7)",
        border: "rgba(40, 167, 69, 1)",
      },
      "Đã hủy": {
        background: "rgba(220, 53, 69, 0.7)",
        border: "rgba(220, 53, 69, 1)",
      },
      "Đang chờ": {
        background: "rgba(255, 193, 7, 0.7)",
        border: "rgba(255, 193, 7, 1)",
      },
      default: {
        background: "rgba(108, 117, 125, 0.7)",
        border: "rgba(108, 117, 125, 1)",
      },
    };
    const labels = reportData.statusStats.map((item) => item.status);
    const data = reportData.statusStats.map((item) => parseInt(item.count, 10));
    const backgroundColors = labels.map(
      (label) => (colorMap[label] || colorMap.default).background
    );
    const borderColors = labels.map(
      (label) => (colorMap[label] || colorMap.default).border
    );
    return {
      labels,
      datasets: [
        {
          label: "Số lượng phiếu đặt",
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };
  };

  prepareLineChartData = () => {
    const { reportData } = this.state;
    if (!reportData || !reportData.bookingsByDay) return {};
    const labels = reportData.bookingsByDay.map((item) =>
      moment(item.date).format("DD/MM")
    );
    const data = reportData.bookingsByDay.map((item) =>
      parseInt(item.count, 10)
    );
    return {
      labels,
      datasets: [
        {
          label: "Số phiếu đặt mới",
          data: data,
          borderColor: "rgb(0, 123, 255)",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    };
  };

  render() {
    const { startDate, endDate, isLoading, reportData, activeFilter } =
      this.state;

    const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: true, position: "bottom" },
      title: {
        display: true,
        text: "Tỉ lệ trạng thái phiếu đặt",
      },
    };

    const lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: true, position: "bottom" },
      title: {
        display: true,
        text: "Lịch sử tạo phiếu đặt",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                if (Number.isInteger(value)) {
                  return value;
                }
              },
            },
          },
        ],
      },
    };

    return (
      <div className="system-main-content">
        <h1 className="title">Báo cáo & Thống kê Phiếu Đặt Sân</h1>
        <div className="statistics-container">
          <div className="filter-container">
            <div className="quick-filters-container">
              <span
                className={`filter-tab ${
                  activeFilter === "allTime" ? "active" : ""
                }`}
                onClick={() => this.handleQuickFilterClick("allTime")}
              >
                Từ trước đến nay
              </span>
              <span
                className={`filter-tab ${
                  activeFilter === "today" ? "active" : ""
                }`}
                onClick={() => this.handleQuickFilterClick("today")}
              >
                Hôm nay
              </span>
              <span
                className={`filter-tab ${
                  activeFilter === "thisWeek" ? "active" : ""
                }`}
                onClick={() => this.handleQuickFilterClick("thisWeek")}
              >
                Tuần này
              </span>
              <span
                className={`filter-tab ${
                  activeFilter === "thisMonth" ? "active" : ""
                }`}
                onClick={() => this.handleQuickFilterClick("thisMonth")}
              >
                Tháng này
              </span>
              <span
                className={`filter-tab ${
                  activeFilter === "thisQuarter" ? "active" : ""
                }`}
                onClick={() => this.handleQuickFilterClick("thisQuarter")}
              >
                Quý này
              </span>
              <span
                className={`filter-tab ${
                  activeFilter === "thisYear" ? "active" : ""
                }`}
                onClick={() => this.handleQuickFilterClick("thisYear")}
              >
                Năm nay
              </span>
              <span
                className={`filter-tab ${
                  activeFilter === "custom" ? "active" : ""
                }`}
                onClick={() => this.handleQuickFilterClick("custom")}
              >
                Tùy chọn
              </span>
            </div>
            {activeFilter === "custom" && (
              <div className="custom-date-filter">
                <div className="filter-group">
                  <label>Từ ngày</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => this.setState({ startDate: date })}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                  />
                </div>
                <div className="filter-group">
                  <label>Đến ngày</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => this.setState({ endDate: date })}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                  />
                </div>
                <div className="filter-group">
                  <button
                    className="btn btn-primary"
                    onClick={this.handleViewReport}
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang tải..." : "Xem báo cáo"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="report-content">
            {isLoading ? (
              <div className="loading-state-chart">
                <i className="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
              </div>
            ) : reportData ? (
              <>
                <div className="kpi-cards-container">
                  <div className="kpi-card total-bookings">
                    <div className="card-icon">
                      <i className="fas fa-ticket-alt"></i>
                    </div>
                    <div className="card-details">
                      <span className="card-title">Tổng phiếu đặt</span>
                      <span className="card-value">
                        {reportData.totalBookings}
                      </span>
                    </div>
                  </div>
                  <div className="kpi-card confirmed">
                    <div className="card-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="card-details">
                      <span className="card-title">Đã xác nhận</span>
                      <span className="card-value">
                        {reportData.confirmedCount}
                      </span>
                    </div>
                  </div>
                  <div className="kpi-card canceled">
                    <div className="card-icon">
                      <i className="fas fa-times-circle"></i>
                    </div>
                    <div className="card-details">
                      <span className="card-title">Đã hủy</span>
                      <span className="card-value">
                        {reportData.canceledCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="charts-grid-container">
                  <div className="chart-container pie-chart-container">
                    <h6>Tỉ lệ trạng thái</h6>
                    {reportData.statusStats &&
                    reportData.statusStats.length > 0 ? (
                      <Pie
                        options={pieChartOptions}
                        data={this.preparePieChartData()}
                      />
                    ) : (
                      <p>Không có dữ liệu.</p>
                    )}
                  </div>
                  <div className="chart-container line-chart-container">
                    <h6>Số phiếu đặt mới theo ngày</h6>
                    {reportData.bookingsByDay &&
                    reportData.bookingsByDay.length > 0 ? (
                      <Line
                        options={lineChartOptions}
                        data={this.prepareLineChartData()}
                      />
                    ) : (
                      <p>Không có dữ liệu.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p>Chưa có dữ liệu để hiển thị.</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default BookingStatsPage;
