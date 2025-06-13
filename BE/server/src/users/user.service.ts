import { MyMailerService } from '../mail/mailer.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { response } from 'express';
import * as bcrypt from 'bcrypt';
import { CartService } from 'src/cart/services/cart.service';
import { MoreThan, LessThan } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MyMailerService,
    private readonly cartService: CartService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto); // Chuyển DTO thành entity
      await this.userRepository.save(user);
      await this.cartService.createCart({ userId: user.id });
    } catch (error) {
      console.log('error while registering', error);
      return false;
    }
    return true;
  }

  findAll() {
    return `This action returns all users`;
  }

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Find a user by its ID
   * @param id The ID of the user to be found
   * @returns A Promise resolving to the user if found, or a 404 response if not
   */
  /******  e3dd31cb-e5d8-4c26-b1dc-6be2d95fca52  *******/
  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return response.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    return {
      success: true,
      message: 'Lấy thông tin người dùng thành công',
      data: user,
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['cart'],
    });
  }

  async countCurrentUsers(): Promise<number> {
    return await this.userRepository.count();
  }

  async countNewUsersLastMonth(): Promise<number> {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    return await this.userRepository.count({
      where: {
        createdAt: MoreThan(oneMonthAgo),
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        return {
          success: false,
          message: 'Người dùng không tồn tại',
          statusCode: 404,
        };
      }
      await this.userRepository.update(id, updateUserDto);
      return {
        success: true,
        message: 'Cập nhật thông tin người dùng thành công',
      };
    } catch (error) {
      console.log('error while updating', error);
      return false;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async updatePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return response.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('Xác nhận mật khẩu không trùng khớp');
    }
    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userRepository.save(user);
    return {
      success: true,
      message: 'Cập nhật mật khẩu thành công',
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { success: false, message: 'Email không tồn tại' };
    }

    function generatePassword(length = 12) {
      const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lower = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      const chars = '!@#$%^&*()_+';
      const allChars = upper + lower + numbers + chars;

      let password =
        upper[Math.floor(Math.random() * upper.length)] +
        lower[Math.floor(Math.random() * lower.length)] +
        numbers[Math.floor(Math.random() * numbers.length)] +
        chars[Math.floor(Math.random() * chars.length)];

      for (let i = 4; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
      }

      return password
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('');
    }

    const newPassword = generatePassword();
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
    await this.mailerService.sendForgotPasswordEmail(user.email, newPassword);
    return {
      success: true,
      message: 'Mật khẩu mới đã được gửi vào email của bạn',
    };
  }
}
