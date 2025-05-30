import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import "../styles/fieldNews.scss";

class fieldNews extends Component {
  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  render() {
    this.scrollToTop();

    return (
      <div className="info-page-wrapper">
        <HomeHeader activeTab="field-news" />

        <HomeFooter />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(fieldNews);
