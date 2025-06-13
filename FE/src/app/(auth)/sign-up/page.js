"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthService from "@/services/auth_service";
import { useMutation } from "@tanstack/react-query";
import AuthLayout from "../layout";
import Link from "next/link";

const SignUp = () => {
  const [notify, setNotify] = useState(null);
  const [colorNotify, setColorNotify] = useState(null);
  const registerUser = useMutation({
    mutationFn: (userData) => AuthService.register(userData),
    onSuccess: (data) => {
      if (data.data.success || data.status === 200 || data.status === 201) {
        setNotify("Đăng ký thành công");
        setColorNotify("text-success");
      }
    },
    onError: (error) => {
      if (error.response) {
        console.log("Lỗi từ server:", error.response.data.message);
        setNotify(error.response.data.message);
        setColorNotify("text-danger");
      } else {
        setNotify(error.message);
        setColorNotify("text-danger");
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
      watch,
  } = useForm();

  const password = watch("password", "");

  const onSubmit = (data, e) => {
    console.log(data)
    const userData = {
      email: data.email,
      fullName: data.fullName,
      address: data.address,
      phoneNumber: data.phoneNumber,
      birthday: parseInt(data.birthday),
      gender: data.gender,
      password: data.password,
      confirmPassword: data.confirmPassword
    };
    registerUser.mutate(userData);
    // setSignupData(data);
  };

  return (
      <AuthLayout bgImage="bg_image--9">
        <div className="axil-signin-form">
          <h3 className="title">Đăng ký</h3>
          <form className="singin-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Email</label>
              <input
                  type="email"
                  className="form-control"
                  {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                  placeholder="example@gmail.com"
              />
              {errors.email && <p className="error">Email is required.</p>}
            </div>

            <div className="form-group">
              <label>Họ và tên</label>
              <input
                  type="text"
                  className="form-control"
                  {...register("fullName", { required: true })}
                  placeholder="Nguyễn Văn A"
              />
              {errors.fullName && <p className="error">Nhập đầy đủ họ và tên.</p>}
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                  type="text"
                  className="form-control"
                  {...register("address", { required: true })}
                  placeholder="123 Street ABC, District 1, HCMC"
              />
              {errors.address && <p className="error">Địa chỉ là bắt buộc.</p>}
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                  type="text"
                  className="form-control"
                  {...register("phoneNumber", { required: true })}
                  placeholder="0987654321"
              />
              {errors.phoneNumber && <p className="error">Số điện thoại là bắt buộc.</p>}
            </div>

            <div className="form-group">
              <label>Năm sinh</label>
              <input
                  type="number"
                  className="form-control appearance-none"
                  {...register("birthday", { required: true })}
                  placeholder="2003"
              />
              {errors.birthday && <p className="error">Năm sinh là bắt buộc.</p>}
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select
                  className="form-control"
                  {...register("gender", { required: true })}
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
              {errors.gender && <p className="error">Giới tính là bắt buộc.</p>}
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                  type="password"
                  className="form-control"
                  {...register("password", { required: true, minLength: 8 })}
              />
              {errors.password && <p className="error">Mật khẩu là bắt buộc (Ít nhất 8 kỹ tự).</p>}
            </div>

            <div className="form-group">
              <label>Nhập lại mật khẩu</label>
              <input
                  type="password"
                  className="form-control"
                  {...register("confirmPassword", {
                    required: true,
                    validate: value => value === password || "Mật khẩu không khớp."
                  })}
              />
              {errors.confirmPassword && <p className="error">
                {errors.confirmPassword.message || "Xác nhận mật khẩu là bắt buộc."}
              </p>}
            </div>

            <div className="form-group">
              <button
                  type="submit"
                  className="axil-btn btn-bg-primary submit-btn"
                  disabled={registerUser.isPending}
              >
                {registerUser.isPending ? "Đang xử lý..." : "Tạo tài khoản"}
              </button>
            </div>

            <p className={`error ${colorNotify}`}>{notify}</p>

            <div className="form-group">
              <p>
                Bạn đã có tài khoản? <Link href="/sign-in" className="forgot-btn">Đăng nhập</Link>
              </p>
            </div>
          </form>
        </div>
      </AuthLayout>
  );
};

export default SignUp;
