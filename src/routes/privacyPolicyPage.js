import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../containers/HomePage/HomeHeader";
import HomeFooter from "../containers/HomePage/HomeFooter";
import "../styles/policy.scss";

class privacyPolicyPage extends Component {
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  render() {
    return (
      <React.Fragment>
        <HomeHeader />
        <div className="privacy-policy-wrapper">
          <div className="privacy-policy-container">
            <div className="privacy-policy-title">Chính sách bảo mật</div>

            <div className="privacy-policy-section">
              <h2>Mục đích thu thập thông tin</h2>
              <p>
                Chúng tôi thu thập thông tin để quản lý đơn đặt sân, cung cấp
                dịch vụ và cải thiện trải nghiệm người dùng. Dữ liệu giúp chúng
                tôi nâng cao chất lượng dịch vụ, hỗ trợ người dùng khi cần thiết
                và đảm bảo quyền lợi cho khách hàng.
              </p>
            </div>

            <div className="privacy-policy-section">
              <h2>Thông tin thu thập</h2>
              <p>
                Các thông tin bao gồm: họ tên, email, số điện thoại, địa chỉ,
                giới tính (nếu cung cấp), lịch sử đặt sân, thông tin thiết bị
                truy cập và các dữ liệu về hoạt động sử dụng website của bạn.
              </p>
            </div>

            <div className="privacy-policy-section">
              <h2>Bảo mật thông tin</h2>
              <p>
                Chúng tôi cam kết bảo vệ thông tin cá nhân bằng các biện pháp kỹ
                thuật và tổ chức hợp lý. Chỉ nhân viên có thẩm quyền mới được
                phép truy cập dữ liệu khi cần thiết. Thông tin không được tiết
                lộ ra bên ngoài trừ khi có sự đồng ý của bạn hoặc theo yêu cầu
                của pháp luật.
              </p>
            </div>

            <div className="privacy-policy-section">
              <h2>Thời gian lưu trữ thông tin</h2>
              <p>
                Dữ liệu cá nhân sẽ được lưu trữ trong thời gian cần thiết để
                thực hiện các mục đích đã đề ra hoặc theo yêu cầu pháp luật. Khi
                không còn cần thiết, thông tin sẽ được xoá hoặc ẩn danh hoá.
              </p>
            </div>

            <div className="privacy-policy-section">
              <h2>Quyền của người dùng</h2>
              <p>
                Bạn có thể yêu cầu chỉnh sửa, xoá hoặc cung cấp bản sao dữ liệu
                cá nhân bất kỳ lúc nào. Chúng tôi luôn tôn trọng và hỗ trợ quyền
                riêng tư của người dùng theo quy định pháp luật.
              </p>
            </div>

            <div className="privacy-policy-section">
              <h2>Liên hệ</h2>
              <p>
                Nếu bạn có bất kỳ câu hỏi nào về chính sách, vui lòng liên hệ
                với chúng tôi qua email: sanbongminioldtrafford@gmail.com hoặc
                số điện thoại: 0123 456 789.
              </p>
            </div>
          </div>
        </div>
        <HomeFooter />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

export default connect(mapStateToProps)(privacyPolicyPage);
