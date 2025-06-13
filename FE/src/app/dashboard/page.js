"use client";
import { useSelector } from "react-redux";


const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <div className="axil-dashboard-overview">
        <div className="welcome-text">
          Xin chào {user?.fullName} (not <span>{user?.fullName}?</span>{" "}
          <a href="/sign-in">Log Out</a>)
        </div>
        <p>
          Từ bảng điều khiển tài khoản, bạn có thể xem các đơn hàng gần đây, quản lý địa chỉ giao hàng và thanh toán cũng như chỉnh sửa mật khẩu và thông tin tài khoản.
        </p>
      </div>
    </>
  );
};

export default Dashboard;
