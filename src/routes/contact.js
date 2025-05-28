import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import "../styles/contact.scss"; // File SCSS cho ContactPage

class ContactPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      fullName: "",
      phoneNumber: "",
      subject: "",
      message: "",
    };
  }

  componentDidMount() {
    this.scrollToTop();
  }

  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu form đã gửi:", this.state);
    alert("Cảm ơn bạn đã gửi liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.");
    this.setState({
      email: "",
      fullName: "",
      phoneNumber: "",
      subject: "",
      message: "",
    });
  };

  render() {
    return (
      <div className="info-page-wrapper">
        <HomeHeader activeTab="contact" />

        <div className="contact-page-container">
          <h1 className="contact-page-title">Liên hệ với chúng tôi</h1>
          <p className="contact-intro">
            Chúng tôi luôn sẵn lòng lắng nghe ý kiến phản hồi từ bạn. Vui lòng
            điền vào biểu mẫu dưới đây hoặc liên hệ qua các kênh cộng đồng của
            chúng tôi.
          </p>

          <div className="contact-section contact-form-section">
            <form onSubmit={this.handleSubmit} className="contact-form">
              {/* Nhóm các trường thông tin cá nhân */}
              <div className="form-group-personal">
                <div className="form-group">
                  <label htmlFor="email">Email của bạn *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    placeholder="vd: emailcuaban@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fullName">
                    Họ và tên (Tùy chọn, có thể ẩn danh)
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={this.state.fullName}
                    onChange={this.handleChange}
                    placeholder="Nhập tên của bạn"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Số điện thoại (Tùy chọn)</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={this.state.phoneNumber}
                    onChange={this.handleChange}
                    placeholder="vd: 0912345678"
                  />
                </div>
              </div>

              {/* Trường Chủ đề */}
              <div className="form-group form-group-subject">
                <label htmlFor="subject">Chủ đề *</label>
                <select
                  id="subject"
                  name="subject"
                  value={this.state.subject}
                  onChange={this.handleChange}
                  required
                >
                  <option value="">Chọn chủ đề</option>
                  <option value="Hỗ trợ Kỹ thuật">Hỗ trợ Kỹ thuật</option>
                  <option value="Ý kiến Phản hồi">Ý kiến Phản hồi</option>
                  <option value="Vấn đề Đặt sân">Vấn đề Đặt sân</option>
                  <option value="Hợp tác Kinh doanh">Hợp tác Kinh doanh</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              {/* Trường Nội dung tin nhắn */}
              <div className="form-group form-group-message">
                <label htmlFor="message">Nội dung tin nhắn *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="8" // Tăng số hàng để textarea dài hơn
                  value={this.state.message}
                  onChange={this.handleChange}
                  placeholder="Viết tin nhắn của bạn tại đây..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-button">
                Gửi tin nhắn
              </button>
            </form>
          </div>

          <div className="contact-section community-section">
            <h2>Kết nối với Cộng đồng của chúng tôi</h2>
            <div className="community-links">
              <a
                href="https://www.facebook.com/profile.php?id=61576305751101"
                target="_blank"
                rel="noopener noreferrer"
                className="community-link facebook"
              >
                <i className="fab fa-facebook"></i> Facebook
              </a>
              <a
                href="https://zalo.me/0333271602"
                target="_blank"
                rel="noopener noreferrer"
                className="community-link zalo"
              >
                <div className="zalo-icon"></div> Zalo
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="community-link youtube"
              >
                <i className="fab fa-youtube"></i> YouTube
              </a>
            </div>
          </div>

          <hr className="divider" />

          <div className="contact-section useful-links-section">
            <h2>Thông tin và Hỗ trợ</h2>
            <ul className="useful-links">
              <li>
                <a href="/faq">Câu hỏi thường gặp (FAQ)</a>
              </li>
              <li>
                <a href="/how-to-book">Hướng dẫn đặt sân</a>
              </li>
              <li>
                <a href="/terms-and-conditions">Quy định và Điều khoản</a>
              </li>
              <li>
                <a href="/privacy-policy">Chính sách bảo mật</a>
              </li>
            </ul>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactPage);
