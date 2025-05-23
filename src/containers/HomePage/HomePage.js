import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import "../../styles/homePage.scss";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.scrollContainerRef = React.createRef();
  }

  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  render() {
    this.scrollToTop();
    return (
      <div className="home-page-wrapper">
        <HomeHeader activeTab="home" />

        <div
          className="home-scroll-container"
          id="scroll-container"
          ref={this.scrollContainerRef}
        >
          <div className="home-header-banner" id="home-top">
            <div className="title1">
              Hệ thống đặt sân bóng mini Old Trafford
            </div>
            <div className="title2">
              Trải nghiệm đặt sân nhanh chóng - dễ dàng - mọi lúc mọi nơi{" "}
            </div>
            <div className="link-book">
              <button
                className="btn-book"
                onClick={() => (window.location.href = "/field-booking")}
              >
                <span>Đặt sân ngay </span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <section className="section section2">
            <div className="intro-wrapper">
              <div className="section-reason-header">
                <h2>
                  Lý do bạn nên đặt sân tại{" "}
                  <span className="txt-2">Old Trafford</span>
                </h2>
              </div>
              <div className="benefit-row">
                <div className="benefit-box">
                  <i className="fas fa-futbol"></i>
                  <h3>Sân bóng đạt chuẩn</h3>
                  <p>
                    Đảm bảo chất lượng mặt sân, ánh sáng và an toàn thi đấu.
                  </p>
                </div>
                <div className="benefit-box">
                  <i className="fas fa-bolt"></i>
                  <h3>Đặt sân siêu tốc</h3>
                  <p>Chỉ vài cú click là hoàn tất đặt sân trong vài giây.</p>
                </div>
                <div className="benefit-box">
                  <i className="fas fa-bell"></i>
                  <h3>Không bỏ lỡ lịch đặt</h3>
                  <p>Thông báo nhắc lịch giúp bạn luôn đúng giờ.</p>
                </div>
              </div>

              <div className="learn-more-wrapper">
                <button
                  className="btn-learn-more"
                  onClick={() => (window.location.href = "/information")}
                >
                  <span className="text-about">Tìm hiểu thêm về chúng tôi</span>
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </section>

          <section className="section section3">
            <div className="guide-container">
              <div className="guide-left">
                <img alt="Hướng dẫn đặt sân" className="guide-image" />
              </div>
              <div className="guide-right">
                <p className="guide-subtitle">Các bước thực hiện</p>
                <h2 className="guide-title">ĐĂNG KÍ THUÊ SÂN</h2>
                <div className="step-list">
                  <div className="step-item">
                    <i class="fas fa-user-plus step-icon"></i>
                    <div>
                      <strong>Bước 1:</strong>
                      <p className="sub-minitext">
                        Đăng ký và thiết lập tài khoản.
                      </p>
                    </div>
                  </div>
                  <div className="step-item">
                    <i class="fas fa-list-ul step-icon"></i>
                    <div>
                      <strong>Bước 2:</strong>
                      <p className="sub-minitext">
                        Vào mục Đặt sân, chọn Đăng ký sân.
                      </p>
                    </div>
                  </div>
                  <div className="step-item">
                    <i class="fas fa-calendar-plus step-icon"></i>
                    <div>
                      <strong>Bước 3:</strong>
                      <p className="sub-minitext">
                        Điền đầy đủ thông tin cần thiết.
                      </p>
                    </div>
                  </div>
                  <div className="step-item">
                    <i className="fas fa-money-bill-wave step-icon"></i>
                    <div>
                      <strong>Bước 4:</strong>
                      <p className="sub-minitext">
                        Xác nhận và thanh toán phí thuê sân (banking trước nếu
                        chọn phương thức thanh toán online).
                      </p>
                    </div>
                  </div>
                  <div className="step-item">
                    <i className="fas fa-check-circle step-icon"></i>
                    <div>
                      <strong>Bước 5:</strong>
                      <p className="sub-minitext">
                        Nhận thông tin xác nhận và đến sân đúng giờ.
                      </p>
                      <p className="sub-minitext">
                        Thông báo sẽ gửi đến email đã đăng ký trước 1 ngày và 30
                        phút trước giờ bóng lăn.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section section4">
            <div className="activities-container">
              <h2>
                Hoạt động sôi nổi tại{" "}
                <span className="txt-3">Old Trafford</span>
              </h2>
              <p className="desc">
                Chúng tôi vinh dự được chọn để tổ chức các giải đấu cấp độ khu
                vực cũng như các giải bóng đá phong trào thường niên hấp dẫn,
                đem đến không khí thi đấu sôi động và gắn kết cộng đồng. Người
                chơi có thể dễ dàng theo dõi lại những khoảnh khắc ấn tượng qua
                các video highlight chất lượng cao trên website của Old
                Trafford.
              </p>

              <div className="activity-gallery">
                <div className="activity-box img1"></div>
                <div className="activity-box img2"></div>
                <div className="activity-box img3"></div>
              </div>

              <div className="news-button-wrapper">
                <button
                  className="btn-news"
                  onClick={() => (window.location.href = "/field-news")}
                >
                  <span>Xem thêm tại mục Tin Tức</span>
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </section>

          <section className="section section5">
            <div className="community-container">
              <div className="community-left">
                <div className="community-invite">
                  <h2>
                    Hơn 500 đội bóng đã tin tưởng lựa chọn{" "}
                    <span className="txt-3">Old Trafford</span>
                  </h2>
                  <p>Gia nhập cộng đồng đam mê bóng đá ngay hôm nay!</p>

                  <div className="social-icons">
                    <a
                      href="https://www.facebook.com/profile.php?id=61576305751101"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-facebook-square"></i>
                    </a>
                    <a
                      href="https://zalo.me/0333271602"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-comments"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="community-right">
                <div className="image-frame">
                  <div className="community-bg-image"></div>
                </div>
              </div>
            </div>

            <div className="scroll-top-button-wrapper">
              <button
                type="button"
                className="scroll-top-btn"
                onClick={this.scrollToTop}
              >
                <i className="fas fa-arrow-up"></i>
              </button>
            </div>
          </section>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
