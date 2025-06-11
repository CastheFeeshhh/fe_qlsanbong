import React, { Component } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getRevenueStatistics } from "../../services/statisticsService";
import { toast } from "react-toastify";
import { Line } from "react-chartjs-2";
import "../../styles/statisticsPage.scss";

class StatisticsPage extends Component {
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

      let response = await getRevenueStatistics(
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

  handleViewReport = () => {
    this.fetchReportData();
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

  formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "0 VNĐ";
    return parseFloat(amount).toLocaleString("vi-VN") + " VNĐ";
  };

  prepareChartData = () => {
    const { reportData } = this.state;
    if (!reportData || !reportData.revenueByDay) return {};

    const labels = reportData.revenueByDay.map((item) =>
      moment(item.date).format("DD/MM")
    );
    const data = reportData.revenueByDay.map((item) =>
      parseFloat(item.revenue)
    );

    return {
      labels,
      datasets: [
        {
          label: "Doanh thu (VNĐ)",
          data: data,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  render() {
    const { startDate, endDate, isLoading, reportData, activeFilter } =
      this.state;

    const chartOptions = {
      responsive: true,
      title: {
        display: true,
        text: `Biểu đồ doanh thu`,
        fontSize: 18,
      },
      legend: {
        display: true,
        position: "top",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                return value.toLocaleString("vi-VN") + " VNĐ";
              },
            },
          },
        ],
      },
    };

    return (
      <div className="system-main-content">
        <h1 className="title">Báo cáo & Thống kê Doanh thu</h1>
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
                  <div className="kpi-card revenue">
                    <div className="card-icon">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="card-details">
                      <span className="card-title">Tổng doanh thu</span>
                      <span className="card-value">
                        {this.formatCurrency(reportData.totalRevenue)}
                      </span>
                    </div>
                  </div>
                  <div className="kpi-card invoices">
                    <div className="card-icon">
                      <i className="fas fa-file-invoice"></i>
                    </div>
                    <div className="card-details">
                      <span className="card-title">Tổng số hóa đơn</span>
                      <span className="card-value">
                        {reportData.totalInvoices}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="chart-container">
                  {reportData.revenueByDay &&
                  reportData.revenueByDay.length > 0 ? (
                    <Line
                      options={chartOptions}
                      data={this.prepareChartData()}
                    />
                  ) : (
                    <p>Không có dữ liệu doanh thu theo ngày để vẽ biểu đồ.</p>
                  )}
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

export default StatisticsPage;
