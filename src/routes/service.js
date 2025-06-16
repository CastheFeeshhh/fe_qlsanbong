import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import "../styles/service.scss";

class service extends Component {
  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  render() {
    this.scrollToTop();

    const services = [
      {
        title: "👕 Áo pitch",
        details: [
          "Áo tập thoáng khí, nhiều màu, chất liệu co giãn.",
          "Cho thuê: 10.000đ / cái",
        ],
        imageClass: "img1-service",
      },
      {
        title: "⚽ Bóng",
        details: [
          "Bóng đá tiêu chuẩn số 4 - 5, chất liệu bền.",
          "Cho thuê: 40.000đ / quả",
        ],
        imageClass: "img2-service",
      },
      {
        title: "👟 Giày",
        details: [
          "Giày đá bóng size 40 - 45, bám sân tốt, chống trượt.",
          "Cho thuê: 30.000đ / đôi",
        ],
        imageClass: "img3-service",
      },
      {
        title: "🧦 Tất",
        details: [
          "Tất cao cổ thể thao, dễ giặt, co giãn 4 chiều.",
          "Cho thuê: 8.000đ / đôi",
        ],
        imageClass: "img4-service",
      },
      {
        title: "🧤 Găng tay",
        details: [
          "Găng tay thủ môn chất lượng cao, chống trượt, tăng độ bám.",
          "Cho thuê: 30.000đ / đôi",
        ],
        imageClass: "img5-service",
      },
      {
        title: "🦿 Ốp bảo vệ",
        details: [
          "Bảo vệ ống đồng khi thi đấu, chất liệu nhẹ và bền.",
          "Cho thuê: 15.000đ / cặp",
        ],
        imageClass: "img6-service",
      },
      {
        title: "🥤 Nước giải khát",
        details: [
          "Nước lọc, nước thể thao, nước vối kèm đá, giải tỏa cơn khát.",
          "Mua: từ 7.000đ / chai",
        ],
        imageClass: "img7-service",
      },
      {
        title: "🧻 Khăn giấy",
        details: [
          "Khăn giấy ướt tiện lợi, 50 tờ đôi / gói.",
          "Mua: 16.000đ / gói",
        ],
        imageClass: "img8-service",
      },
    ];

    return (
      <div className="service-page-wrapper">
        <HomeHeader activeTab="about" />
        <div className="service-wrapper">
          {services.map((service, index) => (
            <div
              className={`service-item ${
                index % 2 === 0 ? "left-item" : "right-item"
              }`}
              key={index}
            >
              <div className="service-image-frame">
                <div className={`service-image ${service.imageClass}`} />
              </div>
              <div className="service-content">
                <h3>
                  <strong>{service.title}</strong>
                </h3>
                {service.details.map((detail, i) => (
                  <p key={i}>{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <HomeFooter />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.isLoggedIn,
});

export default connect(mapStateToProps)(service);
