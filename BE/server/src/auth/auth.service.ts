import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/auth.dto';
import { UserService } from 'src/users/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const { email, fullName, password, confirmPassword } = createUserDto;
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }

    // Kiểm tra mật khẩu và nhập lại mật khẩu
    if (password !== confirmPassword) {
      throw new BadRequestException('Mật khẩu không khớp');
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lấy chữ cái đầu tiên của họ để tạo avatar
    const avatar = this.generateAvatar(fullName);

    // Tạo user
    return await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
      avatar,
    });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Kiểm tra email tồn tại
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }
    // Kiểm tra mật khẩu
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Mật khẩu không đúng');
    }
    const payload = {
      sub: user.id,
      role: user.role,
      cartId: user.cart.id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '7d',
      }),
    };
  }

  async refreshToken(refresh_token: string) {
    const payload = await this.jwtService.verifyAsync(refresh_token, {
      secret: process.env.JWT_SECRET_KEY,
    });
    if (!payload) {
      throw new BadRequestException('Invalid token');
    }
    return {
      access_token: await this.jwtService.signAsync(
        {
          sub: payload.sub,
          role: payload.role,
          cartId: payload.cartId,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
        },
      ),
      refresh_token: await this.jwtService.signAsync(
        {
          sub: payload.sub,
          role: payload.role,
          cartId: payload.cartId,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: '7d',
        },
      ),
    };
  }

  // update(id: number, updateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  private generateAvatar(fullName: string): string {
    const name = fullName.split(' ');
    const initials =
      name.length > 1
        ? name[name.length - 2][0].toUpperCase() +
          name[name.length - 1][0].toUpperCase()
        : name[0][0].toUpperCase();

    // Hàm tạo màu nền ngẫu nhiên
    const bgColor = this.getRandomColor();

    // Tự động chọn màu chữ nổi bật (đen hoặc trắng)
    const textColor = this.getContrastColor(bgColor);

    return `https://ui-avatars.com/api/?name=${initials}&background=${bgColor}&color=${textColor}&size=128&rounded=true`;
  }

  // Hàm tạo màu nền ngẫu nhiên
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color; // Trả về mã màu hex (VD: "A1B2C3")
  }

  // Hàm kiểm tra độ sáng của màu và chọn màu chữ phù hợp
  private getContrastColor(hex: string): string {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Công thức tính độ sáng (luminance)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Nếu màu nền sáng -> chọn màu chữ đen, ngược lại chọn trắng
    return brightness > 128 ? '000000' : 'FFFFFF';
  }
}
