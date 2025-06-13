"use client";
import AuthService from "@/services/auth_service";
import Alert from "@/utils/alert/alert";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const ForgotPassword = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const userForgotPassword = useMutation({
    mutationFn: ({ email }) => AuthService.forgotPassword(email),
    onSuccess: (data) => {
      if (data.data.success) {
        Alert.notify("Thành công", "Mật khẩu đã được gửi về email của bạn!", "success").then(() => {
          router.push("/sign-in");
        });
      }else{
        Alert.notify("Thất bại", data.data.message, "error").then(() => {
        });
      }
    },
    onError: (error) => {
      if (error.response) {
        Alert.notify("Thất bại", error.response.data.message, "error").then(() => {
        });
      } else {
        Alert.notify("Thất bại", error.response.data.message, "error").then(() => {
        });
      }
    }
  });
  const onSubmit = (data) => {
    userForgotPassword.mutate({ email: data.email });
  };
  return (
    <div className="axil-signin-form">
      <h3 className="title">Quên mật khẩu?</h3>
      <form className="singin-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            placeholder="annie@example.com"
          />
          {errors.email && <p className="error">Trường thông tin bắt buộc.</p>}
        </div>
        <div className="form-group">
          <button type="submit" className="axil-btn btn-bg-primary submit-btn">
            Xác nhận
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
