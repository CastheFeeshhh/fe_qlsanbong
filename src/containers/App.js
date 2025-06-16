import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";

import { path } from "../utils";
import { restoreLogin } from "../store/actions/userActions";

import Home from "../routes/home";
import Login from "./Auth/Login";
import ResetPassword from "./Auth/ResetPassword";
import System from "../routes/System";
import AccessDeniedPage from "../routes/AccessDeniedPage";
import UserProfile from "../routes/userProfile";

import HomePage from "./HomePage/homePage";
import information from "../routes/information";
import fieldList from "../routes/fieldList";
import service from "../routes/service";
import fieldMap from "../routes/fieldMap";
import fieldBooking from "../routes/fieldBooking";
import bookingSchedule from "../routes/bookingSchedule";
import fieldNews from "../routes/fieldNews";
import contact from "../routes/contact";
import payment from "../routes/payment";
import paymentReturn from "../routes/paymentReturn";
import privacyPolicyPage from "../routes/privacyPolicyPage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bootstrapped: false,
    };
  }
  handlePersistorState = () => {
    const { persistor } = this.props;
    const { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      this.setState({ bootstrapped: true });
    } else {
      persistor.subscribe(() => {
        const { bootstrapped } = persistor.getState();
        if (bootstrapped) {
          this.setState({ bootstrapped: true });
        }
      });
    }
  };

  componentDidMount() {
    this.handlePersistorState();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user && !this.props.isLoggedIn) {
      const userInfo = { ...user, token };
      this.props.restoreLogin(userInfo);

      console.log("userInfo ở app.js: ", userInfo);
      console.log("token ở app.js: ", token);
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      const token = localStorage.getItem("token");
      if (token) {
        const userInfo = { token };
        console.log("trạng thái đăng nhập: isLogin:", this.props.isLoggedIn);
      }
    }
  }

  render() {
    if (!this.state.bootstrapped) {
      return null;
    }
    console.log("User info trong render App.js:", this.props.userInfo);
    console.log(
      "trạng thái đăng nhập: isLogin trong render:",
      this.props.isLoggedIn
    );

    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            <span className="content-container">
              <Switch>
                <Route path={path.HOME} exact component={Home} />
                <Route path={path.LOGIN} component={Login} />
                <Route path={path.RESET_PASSWORD} component={ResetPassword} />
                <Route path={path.SYSTEM} component={System} />
                <Route path={path.PROFILE} component={UserProfile} />
                <Route path={path.ACCESS_DENIED} component={AccessDeniedPage} />
                <Route path={path.HOMEPAGE} component={HomePage} />
                <Route path={path.INFORMATION} component={information} />
                <Route path={path.FIELDLIST} component={fieldList} />
                <Route path={path.SERVICE} component={service} />
                <Route path={path.FIELDMAP} component={fieldMap} />
                <Route path={path.FIELDBOOKING} component={fieldBooking} />
                <Route path={path.SCHEDULE} component={bookingSchedule} />
                <Route path={path.FIELDNEWS} component={fieldNews} />
                <Route path={path.CONTACT} component={contact} />
                <Route path={path.PAYMENT} component={payment} />
                <Route path={path.VNPAY} component={payment} />
                <Route path={path.PAYMENTRETURN} component={paymentReturn} />
                <Route
                  path={path.PRIVACYPOLICY}
                  component={privacyPolicyPage}
                />
              </Switch>
            </span>
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    restoreLogin: (userInfo) => dispatch(restoreLogin(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
