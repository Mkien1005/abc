import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
  Matches,
  Validate,
} from 'class-validator';
import { Match } from './match.decorator.dto';
enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  @Matches(/^[0-9]{10,11}$/, { message: 'Số điện thoại phải có 10-11 chữ số' })
  phoneNumber: string;

  @IsNumber({}, { message: 'Năm sinh không hợp lệ' })
  @Min(1900, { message: 'Năm sinh không hợp lệ' })
  @Max(new Date().getFullYear(), {
    message: 'Năm sinh không thể lớn hơn năm hiện tại',
  })
  birthday: number;

  @IsEnum(Gender, { message: 'Giới tính không hợp lệ' })
  gender: Gender;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Nhập lại mật khẩu không được để trống' })
  @Validate(Match, ['password'], {
    message: 'Nhập lại mật khẩu không trùng khớp với mật khẩu',
  })
  confirmPassword: string;
}
