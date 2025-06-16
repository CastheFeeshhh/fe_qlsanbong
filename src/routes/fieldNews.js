import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { getAllNews } from "../services/userService";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import "../styles/fieldNews.scss";
import "moment/locale/vi";
moment.locale("vi");

class fieldNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsList: [],
      isLoading: true,
      visibleCount: 6,
    };
  }

  async componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.fetchNews();
  }

  fetchNews = async () => {
    this.setState({ isLoading: true });
    let response = await getAllNews();
    if (response && response.errCode === 0 && Array.isArray(response.data)) {
      this.setState({
        newsList: response.data,
        isLoading: false,
      });
    } else {
      this.setState({ isLoading: false });
    }
  };

  handleLoadMore = () => {
    this.setState({
      visibleCount: this.state.newsList.length,
    });
  };

  render() {
    const { newsList, isLoading, visibleCount } = this.state;
    const visibleNews = newsList.slice(0, visibleCount);

    return (
      <div className="info-page-wrapper">
        <HomeHeader activeTab="field-news" />
        <div className="news-container">
          <div className="news-header">
            <h1>Tin Tức & Sự Kiện</h1>
            <p>
              Khám phá mọi thông tin từ sân bóng, những câu chuyện bên lề thú
              vị, đến tin tức bóng đá trong nước và quốc tế.
            </p>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i> Đang tải tin tức...
            </div>
          ) : (
            <>
              <div className="news-grid">
                {visibleNews && visibleNews.length > 0 ? (
                  visibleNews.map((item) => (
                    <Link
                      to={`/news/${item.news_id}`}
                      className="news-card"
                      key={item.news_id}
                    >
                      <div className="card-image">
                        {item.media_url &&
                        item.media_url.includes("youtube.com") ? (
                          <iframe
                            src={item.media_url}
                            title={item.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div
                            className="card-img-div"
                            style={{
                              backgroundImage: `url(${item.media_url})`,
                            }}
                          />
                        )}
                      </div>
                      <div className="card-content">
                        <h3 className="card-title">{item.title}</h3>
                        <p className="card-summary">{item.summary}</p>
                        <div className="card-meta">
                          <span>
                            bởi{" "}
                            {item.User?.first_name +
                              " " +
                              item.User?.last_name || "Ẩn danh"}
                          </span>
                          <span>
                            {moment(item.created_at).format("DD/MM/YYYY")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>Chưa có tin tức nào để hiển thị.</p>
                )}
              </div>

              {visibleCount < newsList.length && (
                <div className="load-more-container">
                  <button
                    className="load-more-btn"
                    onClick={this.handleLoadMore}
                  >
                    <span>Xem thêm</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
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
