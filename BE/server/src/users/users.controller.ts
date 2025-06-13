import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserService } from './user.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }
  @Patch('change-password')
  async updatePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const id = req.user.sub;
    return await this.userService.updatePassword(id, changePasswordDto);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }
  @Get()
  findOne(@Req() req: any) {
    const id = req.user.sub;
    return this.userService.findOne(id);
  }

  @Get('count-current-users')
  async getCountCurrentUsers() {
    return {
      success: true,
      data: await this.userService.countCurrentUsers(),
    };
  }

  @Get('count-new-last-month')
  async getCountNewUsersLastMonth() {
    return {
      success: true,
      data: await this.userService.countNewUsersLastMonth(),
    };
  }

  @Patch('/update')
  update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user.sub;
    return this.userService.update(id, updateUserDto);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.userService.forgotPassword(email);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
