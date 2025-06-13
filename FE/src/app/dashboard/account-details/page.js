"use client";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { UserService } from "@/services/user_service";
import { useEffect } from "react";
import Swal from "sweetalert2";

const AccountDetails = () => {
  const user = useSelector((state) => state.auth.user);

  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    setValue,
    formState: { errors: infoErrors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      address: user?.address || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  useEffect(() => {
    if (user?.phoneNumber) {
      setValue("phoneNumber", user.phoneNumber);
    }
    if (user?.address) {
      setValue("address", user.address);
    }
    if (user?.fullName) {
      setValue("fullName", user.fullName);
    }
  }, [user, setValue]);

  const updateUserInfo = (data) => {
    UserService.updateUser(user.id, data)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Cập nhật thông tin cá nhân thành công",
        });
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật thông tin cá nhân:", error);
        Swal.fire({
          icon: "error",
          title: "Có lỗi xảy ra, vui lòng thử lại sau",
        });
      });
  };

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    watch,
  } = useForm();

  const changePassword = (data) => {
    UserService.changePassword(data)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Đổi mật khẩu thành công",
        });
      })
      .catch((error) => {
        console.error("Lỗi khi đổi mật khẩu:", error);
        Swal.fire({
          icon: "error",
          title: "Có lỗi xảy ra, vui lòng thử lại sau",
        });
      });
  };

  return (
    <div className="axil-dashboard-account">
      <form
        className="account-details-form"
        onSubmit={handleInfoSubmit(updateUserInfo)}
      >
        <h4 className="title">Cập nhật thông tin cá nhân</h4>
        <div className="form-group">
          <label>Họ và tên</label>
          <input
            type="text"
            className="form-control"
            {...registerInfo("fullName", { required: "Vui lòng nhập họ và tên" })}
          />
          {infoErrors.fullName && (
            <p className="error">{infoErrors.fullName.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Địa chỉ</label>
          <input
            type="text"
            className="form-control"
            {...registerInfo("address", { required: "Vui lòng nhập địa chỉ" })}
          />
          {infoErrors.address && (
            <p className="error">{infoErrors.address.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            className="form-control"
            {...registerInfo("phoneNumber", {
              required: "Vui lòng nhập số điện thoại.",
            })}
          />
          {infoErrors.phoneNumber && (
            <p className="error">{infoErrors.phoneNumber.message}</p>
          )}
        </div>
        <div className="form-group mb--0">
          <input
            type="submit"
            className="axil-btn"
            defaultValue="Save Changes"
          />
        </div>
      </form>

      <hr />

      <form
        className="password-change-form"
        onSubmit={handlePasswordSubmit(changePassword)}
      >
        <h4 className="title">Đổi mật khẩu</h4>

        <div className="form-group">
          <label>Mật khẩu hiện tại</label>
          <input
            type="password"
            className="form-control"
            {...registerPassword("oldPassword", { required: true })}
          />
          {passwordErrors.oldPassword && (
            <p className="error">Vui lòng nhập mật khẩu hiện tại.</p>
          )}
        </div>

        <div className="form-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            className="form-control"
            {...registerPassword("newPassword", {
              required: true,
              minLength: 6,
            })}
          />
          {passwordErrors.newPassword && (
            <p className="error">Mật khẩu mới phải có ít nhất 6 ký tự.</p>
          )}
        </div>

        <div className="form-group">
          <label>Nhập lại mật khẩu mới</label>
          <input
            type="password"
            className="form-control"
            {...registerPassword("confirmPassword", {
              required: true,
              validate: (value) =>
                value === watch("newPassword") || "Mật khẩu không khớp",
            })}
          />
          {passwordErrors.confirmPassword && (
            <p className="error">{passwordErrors.confirmPassword.message}</p>
          )}
        </div>
        <div className="form-group mb--0">
          <input
            type="submit"
            className="axil-btn"
            defaultValue="Save Changes"
          />
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
