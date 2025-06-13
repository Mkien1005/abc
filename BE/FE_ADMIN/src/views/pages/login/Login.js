import { cilLockLocked, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { login } from "../../../api/auth";
import "./LoginCustom.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ email, password });
      if (!result.success) {
        Swal.fire({
          icon: "error",
          title: "Đăng nhập thất bại",
          text: result.message.response.data.message,
        });
        return;
      }
      const role = localStorage.getItem("role");
      if (role === "admin") {
        Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công",
          text: "Chào mừng bạn đến với pharmacy manager!",
        });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Đăng nhập thất bại",
          text: "Bạn không có quyền truy cập!",
        });
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-left">
          <div className="login-image-wrapper">
            <CImage
              fluid
              src="src/assets/images/login.svg"
              width={220}
              height={220}
              className="login-image"
            />
          </div>
          <div className="login-welcome">
            <h2>Quản lý nhà thuốc</h2>
            <p>Chào mừng bạn quay lại!</p>
          </div>
        </div>
        <div className="login-right">
          <CCard className="login-card">
            <CCardBody>
              <CForm onSubmit={handleLogin}>
                <h1 className="login-title">Đăng nhập</h1>
                <p className="login-subtitle">
                  Đăng nhập vào hệ thống quản lý nhà thuốc
                </p>
                <CInputGroup className="login-input-group">
                  <CInputGroupText className="login-input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                  />
                </CInputGroup>
                <CInputGroup className="login-input-group">
                  <CInputGroupText className="login-input-icon">
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Mật khẩu"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                  />
                </CInputGroup>
                <div className="login-actions">
                  <CButton color="primary" className="login-btn" type="submit">
                    Đăng nhập
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  );
};

export default Login;
