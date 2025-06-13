import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Mật khẩu phải có ít nhất 8 ký tự, chữ cái đầu viết hoa, chứa ít nhất một số và một ký tự đặc biệt',
  })
  password: string;
}
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống' })
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Mật khẩu mới phải có ít nhất 8 ký tự, chữ cái đầu viết hoa, chứa ít nhất một số và một ký tự đặc biệt',
  })
  newPassword: string;
}
