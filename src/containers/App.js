import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";

import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";

import { path } from "../utils";

import Home from "../routes/home";
import Login from "./Auth/Login";
import System from "../routes/System";

import { CustomToastCloseButton } from "../components/CustomToast";
import HomePage from "./HomePage/homePage";
import information from "../routes/information";
import fieldList from "../routes/fieldList";
import service from "../routes/service";
import fieldMap from "../routes/fieldMap";
import fieldBooking from "../routes/fieldBooking";
import fieldSchedule from "../routes/fieldSchedule";
import fieldNews from "../routes/fieldNews";
import contact from "../routes/contact";

class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            {/* {this.props.isLoggedIn && <Header />} */}

            <span className="content-container">
              <Switch>
                <Route path={path.HOME} exact component={Home} />
                <Route
                  path={path.LOGIN}
                  s
                  component={userIsNotAuthenticated(Login)}
                />
                <Route
                  path={path.SYSTEM}
                  component={userIsAuthenticated(System)}
                />
                <Route path={path.HOMEPAGE} component={HomePage} />
                <Route path={path.INFORMATION} component={information} />
                <Route path={path.FIELDLIST} component={fieldList} />
                <Route path={path.SERVICE} component={service} />
                <Route path={path.FIELDMAP} component={fieldMap} />
                <Route path={path.FIELDBOOKING} component={fieldBooking} />
                <Route path={path.FIELDSCHEDULE} component={fieldSchedule} />
                <Route path={path.FIELDNEWS} component={fieldNews} />
                <Route path={path.CONTACT} component={contact} />
              </Switch>
            </span>

            <ToastContainer
              className="toast-container"
              toastClassName="toast-item"
              bodyClassName="toast-item-body"
              autoClose={false}
              hideProgressBar={true}
              pauseOnHover={false}
              pauseOnFocusLoss={true}
              closeOnClick={false}
              draggable={false}
              closeButton={<CustomToastCloseButton />}
            />
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
