'use client';

import Footer from '@/components/footer/Footer';
import HeaderFive from '@/components/header/HeaderFive';
import { FaHeartbeat, FaPills, FaStethoscope, FaPhoneAlt, FaCalendarCheck, FaNotesMedical, FaSearch, FaCheckCircle, FaBars, FaUserCircle, FaRegClock, FaGooglePlay, FaApple } from 'react-icons/fa';

export default function MedicalGuide() {
  return (
    <>
    <HeaderFive/>
    <div className="ym-article-content">
      <style jsx>{`
        :root {
          --primary-color: #00a19c;
          --secondary-color: #2c3e50;
          --light-bg: #f8f9fa;
          --border-color: #e5e7eb;
          --text-color: #222;
        }
        .ym-article-content {
          max-width: 800px;
          margin: 32px auto 0 auto;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          padding: 32px 24px 40px 24px;
        }
        .ym-article-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 12px;
        }
        .ym-article-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 0.95rem;
          color: #888;
          margin-bottom: 20px;
        }
        .ym-article-meta .author {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ym-article-meta .date {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ym-toc-box {
          background: #f6f6f6;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 32px;
        }
        .ym-toc-title {
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 10px;
        }
        .ym-toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .ym-toc-list li {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ym-toc-list li svg {
          color: var(--primary-color);
        }
        .ym-section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--primary-color);
          margin: 32px 0 16px 0;
        }
        .ym-section-img {
          display: block;
          max-width: 100%;
          margin: 24px auto;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .ym-info-box {
          background: #f6f6f6;
          border-left: 4px solid var(--primary-color);
          border-radius: 8px;
          padding: 18px 20px;
          margin: 24px 0;
          color: var(--secondary-color);
          font-size: 1.05rem;
        }
        .ym-quote {
          background: #eafaf9;
          border-left: 4px solid var(--primary-color);
          border-radius: 8px;
          padding: 16px 20px;
          margin: 24px 0;
          font-style: italic;
          color: var(--primary-color);
        }
        .ym-app-box {
          background: #f6f6f6;
          border-radius: 10px;
          padding: 24px 20px;
          margin: 32px 0;
          text-align: center;
        }
        .ym-app-title {
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 12px;
        }
        .ym-app-btns {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 12px;
        }
        .ym-app-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary-color);
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 10px 18px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
        }
        .ym-related-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--secondary-color);
          margin: 40px 0 20px 0;
        }
        .ym-related-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
        }
        .ym-related-item {
          background: #f6f6f6;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          text-decoration: none;
          color: var(--secondary-color);
          transition: box-shadow 0.2s;
        }
        .ym-related-item:hover {
          box-shadow: 0 4px 16px rgba(0,161,156,0.10);
        }
        .ym-related-thumb {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }
        .ym-related-content {
          padding: 12px 14px 10px 14px;
        }
        .ym-related-title2 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .ym-badge-list {
          display: flex;
          gap: 24px;
          margin: 32px 0 0 0;
          flex-wrap: wrap;
        }
        .ym-badge {
          background: #fff;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px 24px;
          text-align: center;
          color: var(--primary-color);
          font-weight: 600;
          font-size: 1.05rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        @media (max-width: 600px) {
          .ym-article-content { padding: 16px 4px 32px 4px; }
          .ym-section-title { font-size: 1.1rem; }
          .ym-related-list { grid-template-columns: 1fr; }
        }
      `}</style>
      <h1 className="ym-article-title">[Hé lộ] Cách tìm thông tin y tế, sức khỏe chính thống trên Google không phải ai cũng biết</h1>
      <div className="ym-article-meta">
        <span className="author">YouMed</span>
        <span className="date">Ngày đăng: 13/11/2020</span>
      </div>
      {/* TOC */}
      <div className="ym-toc-box">
        <div className="ym-toc-title">Nội dung bài viết</div>
        <ul className="ym-toc-list">
          <li><FaCheckCircle /> Chủ động tìm kiếm và chọn lọc thông tin y tế, sức khỏe trên Google</li>
          <li><FaCheckCircle /> Tại sao bạn phải gõ thêm từ khóa &quot;YouMed&quot; vào sau triệu chứng/bệnh trên Google?</li>
          <li><FaCheckCircle /> YouMed – Tìm thông tin sức khỏe gì cũng có</li>
          <li><FaCheckCircle /> YouMed – Nền tảng y tế toàn diện</li>
        </ul>
      </div>
      {/* Nội dung bài viết */}
      <div>
        <div className="ym-section-title">Chủ động tìm kiếm và chọn lọc thông tin y tế, sức khỏe trên Google</div>
        <p>Khi cần tìm kiếm thông tin sức khỏe trên Google, bạn nên chủ động chọn lọc nguồn tin chính thống, uy tín. Có quá nhiều thông tin sai lệch, không kiểm chứng sẽ dẫn đến hiểu lầm và ảnh hưởng sức khỏe.</p>
        <img className="ym-section-img" src="https://youmed.vn/tin-tuc/wp-content/uploads/2020/11/Google-Search-YouMed.jpg" alt="Tìm kiếm thông tin y tế trên Google" />
        <div className="ym-info-box">
          <b>Mẹo:</b> Khi tìm kiếm, hãy thêm từ khóa <b>&quot;YouMed&quot;</b> vào sau triệu chứng/bệnh để ưu tiên kết quả chính thống, đã kiểm chứng.
        </div>
        <div className="ym-section-title">Tại sao bạn phải gõ thêm từ khóa &quot;YouMed&quot; vào sau triệu chứng/bệnh trên Google?</div>
        <p>YouMed là trang thông tin y tế duy nhất tại Việt Nam đạt chứng chỉ HON. Đây là tiêu chuẩn quốc tế về độ tin cậy, minh bạch và chính xác của thông tin y tế trên Internet.</p>
        <div className="ym-quote">
          “YouMed được trao chứng nhận bởi Health On the Net Foundation (HON) – tổ chức uy tín hàng đầu thế giới về kiểm duyệt thông tin y tế trực tuyến.”
        </div>
        <img className="ym-section-img" src="https://youmed.vn/tin-tuc/wp-content/uploads/2020/11/YouMed-HONCode.jpg" alt="YouMed đạt chứng nhận HONCode" />
        <div className="ym-section-title">YouMed – Tìm thông tin sức khỏe gì cũng có</div>
        <p>Bạn có thể dễ dàng tra cứu triệu chứng, bệnh, thuốc, dược liệu, bác sĩ, phòng khám… trên hệ thống YouMed. Thông tin được kiểm duyệt, cập nhật liên tục và trình bày dễ hiểu.</p>
        <div className="ym-section-title">YouMed – Nền tảng y tế toàn diện</div>
        <p>YouMed đầu tư lớn vào hệ sinh thái y tế toàn diện, giúp bạn đặt khám, tư vấn, tra cứu sức khỏe mọi lúc mọi nơi.</p>
        <div className="ym-app-box">
          <div className="ym-app-title">Đặt khám tiện lợi cùng YouMed</div>
          <div>+25 Bệnh viện &nbsp; +700 Bác sĩ &nbsp; +89 Phòng khám</div>
          <div className="ym-app-btns">
            <a className="ym-app-btn" href="#"><FaGooglePlay /> Tải ứng dụng YouMed</a>
            <a className="ym-app-btn" href="#" style={{background:'#222'}}><FaApple /> App Store</a>
          </div>
        </div>
      </div>
      {/* Bài viết liên quan */}
      <div className="ym-related-title">Có thể bạn quan tâm</div>
      <div className="ym-related-list">
        <a className="ym-related-item" href="#">
          <img className="ym-related-thumb" src="https://youmed.vn/tin-tuc/wp-content/uploads/2023/06/app-tu-van-bac-si-online.jpg" alt="Tư vấn bác sĩ online" />
          <div className="ym-related-content">
            <div className="ym-related-title2">4 tiêu chí lựa chọn app tư vấn với bác sĩ online uy tín</div>
            <div style={{fontSize:'0.95rem',color:'#888'}}>YouMed • 08/06/2023</div>
          </div>
        </a>
        <a className="ym-related-item" href="#">
          <img className="ym-related-thumb" src="https://youmed.vn/tin-tuc/wp-content/uploads/2023/11/benh-vien-rang-ham-mat-tphcm.jpg" alt="Bệnh viện Răng Hàm Mặt" />
          <div className="ym-related-content">
            <div className="ym-related-title2">Bệnh viện Răng Hàm Mặt Trung ương TP.HCM</div>
            <div style={{fontSize:'0.95rem',color:'#888'}}>YouMed • 21/11/2023</div>
          </div>
        </a>
        <a className="ym-related-item" href="#">
          <img className="ym-related-thumb" src="https://youmed.vn/tin-tuc/wp-content/uploads/2023/11/benh-vien-le-van-thinh.jpg" alt="Bệnh viện Lê Văn Thịnh" />
          <div className="ym-related-content">
            <div className="ym-related-title2">Bệnh viện Lê Văn Thịnh (Quận 2)</div>
            <div style={{fontSize:'0.95rem',color:'#888'}}>YouMed • 21/11/2023</div>
          </div>
        </a>
        <a className="ym-related-item" href="#">
          <img className="ym-related-thumb" src="https://youmed.vn/tin-tuc/wp-content/uploads/2023/11/benh-vien-thanh-pho-thu-duc.jpg" alt="Bệnh viện Thành phố Thủ Đức" />
          <div className="ym-related-content">
            <div className="ym-related-title2">Bệnh viện Thành phố Thủ Đức phục hồi chức năng</div>
            <div style={{fontSize:'0.95rem',color:'#888'}}>YouMed • 21/11/2023</div>
          </div>
        </a>
      </div>
      {/* Badge tin cậy */}
      <div className="ym-badge-list">
        <div className="ym-badge">Chứng nhận &quot;Nội dung y tế xuất bản chuẩn&quot;</div>
        <div className="ym-badge">YouMed hợp tác cùng Hội Dược, TRƯỜNG Y, Hội người bệnh</div>
        <div className="ym-badge">CEO YouMed: &quot;Nội hàm xây dựng y tế toàn diện&quot;</div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
