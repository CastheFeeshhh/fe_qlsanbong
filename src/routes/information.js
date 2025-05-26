import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import "../styles/information.scss";

class information extends Component {
  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  render() {
    this.scrollToTop();
    const sections = [
      {
        title: "🏟️ Giới thiệu chung về sân",
        content:
          "Được đưa vào hoạt động từ tháng 8/2021 cho đến nay, sân bóng Old Trafford đã tạo sân chơi thể thao lành mạnh cho cộng đồng đam mê bóng đá. Sân có mặt cỏ nhân tạo chất lượng cao, ánh sáng tiêu chuẩn và không gian rộng rãi.",
        imageClass: "img1-info",
      },
      {
        title: "📍 Địa chỉ & thời gian hoạt động",
        content:
          "Địa chỉ: LK37 đường Trịnh Văn Bô, Phường Xuân Phương, Quận Nam Từ Liêm, tp. Hà Nội.  Thời gian mở cửa từ 6h đến 22h hàng ngày.",
        imageClass: "img2-info",
      },
      {
        title: "🌐 Về website",
        content:
          "Website hỗ trợ đặt sân online nhanh chóng, theo dõi lịch thuê sân, tích hợp thanh toán trực tuyến, đăng ký dịch vụ đi kèm và nhiều tiện ích khác.",
        imageClass: "img3-info",
      },
      // {
      //   title: "🌐 Về website",
      //   content:
      //     "Website hỗ trợ đặt sân online nhanh chóng, theo dõi lịch thuê sân, tích hợp thanh toán trực tuyến, đăng ký dịch vụ đi kèm và nhiều tiện ích khác.",
      //   imageClass: "img4-info",
      // },
    ];

    return (
      <div className="info-page-wrapper">
        <HomeHeader activeTab="about" />

        <div className="info-wrapper">
          {sections.map((section, index) => {
            const isImageLeft = index % 2 === 0;
            return (
              <div
                key={index}
                className={`info-section ${
                  isImageLeft ? "image-left" : "image-right"
                }`}
              >
                <div className="info-frame">
                  <div className={`info-image ${section.imageClass}`} />
                </div>
                <div className="info-text">
                  <h2>
                    <strong>{section.title}</strong>
                  </h2>
                  <p>{section.content}</p>
                </div>
              </div>
            );
          })}
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

export default connect(mapStateToProps, mapDispatchToProps)(information);
