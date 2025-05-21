import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import "../styles/fieldList.scss";

class fieldList extends Component {
  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  render() {
    this.scrollToTop();
    const sections = [
      {
        title: "⚽ Sân 5",
        content1:
          "Sân nhỏ, phù hợp với luyện tập cá nhân, đá chiến thuật số ít và các lớp đào tạo trẻ.",
        content2: "Kích thước : 32.1m x 21.5m",
        content3: "Giá thuê : 240.000đ/h (6h-16h) - 480.000đ/h (16h-22h)",
        imageClass: "img1-field",
      },
      {
        title: "⚽ Sân 7",
        content1:
          "Sân tiêu chuẩn - số lượng người chơi lý tưởng, được đa số đội bóng lựa chọn. Cân bằng giữa kỹ thuật và thể lực, phù hợp với mọi lứa tuổi.",
        content2: "Kích thước : 50.2m x 32.5m",
        content3: "Giá thuê : 300.000đ/h (6h-16h) - 600.000đ/h (16h-22h)",
        imageClass: "img2-field",
      },
      {
        title: "⚽ Sân 9",
        content1:
          "Sân lớn, kết hợp nhanh từ 2 sân 7. Trải nghiệm gần với bóng đá sân lớn, phát triển chiến thuật đa dạng, phù hợp với các đội bóng có nhiều thành viên tham gia.",
        content2: "Kích thước : 68.6m x 50.2m",
        content3: "Giá thuê : 600.000đ/h (6h-16h) - 1.200.000đ/h (16h-22h)",
        imageClass: "img3-field",
      },
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
                  <p>{section.content1}</p>
                  <p>{section.content2}</p>
                  <p>{section.content3}</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(fieldList);
