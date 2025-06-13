import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch, NavLink } from "react-router-dom";
import UserManage from "../containers/System/UserManage";
import AdminManage from "../containers/System/AdminManage";
import FieldManage from "../containers/System/FieldManage";
import ServiceManage from "../containers/System/ServiceManage";
import SupplierManage from "../containers/System/SupplierManage";
import AssetManage from "../containers/System/AssetManage";
import InvoiceManage from "../containers/System/InvoiceManage";
import AssetInvoiceManage from "../containers/System/AssetInvoiceManage";

import StatisticsPage from "../containers/System/StatisticsPage";

import Header from "../containers/HomePage/HomeHeader";
import Footer from "../containers/HomePage/HomeFooter";
import "../styles/system.scss";
import BookingStatsPage from "../containers/System/BookingStatsPage";

class System extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenus: {
        thongKe: false,
        workManage: false,
      },
    };
  }

  toggleMenu = (menuKey) => {
    this.setState((prevState) => ({
      openMenus: {
        ...prevState.openMenus,
        [menuKey]: !prevState.openMenus[menuKey],
      },
    }));
  };

  render() {
    const { systemMenuPath, isLoggedIn, userInfo } = this.props;

    if (!isLoggedIn) {
      return <Redirect to="/login" />;
    }
    if (userInfo && userInfo.role_id === 3) {
      return <Redirect to="/access-denied" />;
    }

    return (
      <Fragment>
        <Header />
        <div className="system-layout">
          <aside className="system-sidebar">
            <ul className="sidebar-menu">
              <li>
                <NavLink
                  to="/system/dashboard"
                  activeClassName="active"
                  className="menu-item"
                >
                  <i className="fas fa-chart-line"></i> Bảng điều khiển
                </NavLink>
              </li>

              <li className="menu-group">
                <div
                  className="menu-title"
                  onClick={() => this.toggleMenu("thongKe")}
                >
                  <i className="fas fa-chart-pie"></i> Thống kê
                  <i
                    className={`fas ${
                      this.state.openMenus.thongKe
                        ? "fa-angle-up"
                        : "fa-angle-down"
                    } menu-arrow`}
                  ></i>
                </div>
                {this.state.openMenus.thongKe && (
                  <ul className="submenu">
                    <li>
                      <NavLink
                        to="/system/statistics-revenue"
                        activeClassName="active"
                      >
                        Báo cáo doanh thu
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/system/statistics-booking"
                        activeClassName="active"
                      >
                        Thống kê lượt đặt sân
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/system/stats-field"
                        activeClassName="active"
                      >
                        Thống kê sân bóng
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              <li className="menu-group">
                <div
                  className="menu-title"
                  onClick={() => this.toggleMenu("workManage")}
                >
                  <i className="fas fa-tasks"></i> Nghiệp vụ
                  <i
                    className={`fas ${
                      this.state.openMenus.workManage
                        ? "fa-angle-up"
                        : "fa-angle-down"
                    } menu-arrow`}
                  ></i>
                </div>
                {this.state.openMenus.workManage && (
                  <ul className="submenu">
                    {userInfo && userInfo.role_id === 1 && (
                      <li>
                        <NavLink
                          to="/system/admin-manage"
                          activeClassName="active"
                        >
                          Quản lý nhân viên
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <NavLink
                        to="/system/user-manage"
                        activeClassName="active"
                      >
                        Quản lý người dùng
                      </NavLink>
                    </li>
                    {userInfo && userInfo.role_id === 1 && (
                      <li>
                        <NavLink
                          to="/system/supplier-manage"
                          activeClassName="active"
                        >
                          Quản lý nhà cung cấp
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <NavLink
                        to="/system/field-manage"
                        activeClassName="active"
                      >
                        Quản lý sân bóng
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/system/service-manage"
                        activeClassName="active"
                      >
                        Quản lý dịch vụ
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/system/asset-manage"
                        activeClassName="active"
                      >
                        Quản lý tài sản thiết bị
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/system/invoice-manage"
                        activeClassName="active"
                      >
                        Quản lý hóa đơn đặt sân
                      </NavLink>
                    </li>
                    {userInfo && userInfo.role_id === 1 && (
                      <li>
                        <NavLink
                          to="/system/asset-invoice-manage"
                          activeClassName="active"
                        >
                          Quản lý hóa đơn nhập hàng
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <NavLink
                        to="/system/receipt-manage"
                        activeClassName="active"
                      >
                        Quản lý phiếu đặt sân
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <NavLink
                  to="/system/settings"
                  activeClassName="active"
                  className="menu-item"
                >
                  <i className="fas fa-cog"></i> Cài đặt
                </NavLink>
              </li>
            </ul>
          </aside>
          <main className="system-main-content">
            <Switch>
              <Route
                path="/system/statistics-revenue"
                component={StatisticsPage}
              />
              <Route
                path="/system/statistics-booking"
                component={BookingStatsPage}
              />

              <Route path="/system/user-manage" component={UserManage} />
              <Route path="/system/admin-manage" component={AdminManage} />
              <Route path="/system/field-manage" component={FieldManage} />
              <Route path="/system/service-manage" component={ServiceManage} />
              <Route path="/system/service-manage" component={ServiceManage} />
              <Route path="/system/asset-manage" component={AssetManage} />
              <Route path="/system/invoice-manage" component={InvoiceManage} />
              <Route
                path="/system/asset-invoice-manage"
                component={AssetInvoiceManage}
              />
              <Route
                path="/system/supplier-manage"
                component={SupplierManage}
              />

              <Route
                component={() => {
                  return (
                    <Redirect to={systemMenuPath || "/system/dashboard"} />
                  );
                }}
              />
            </Switch>
          </main>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
