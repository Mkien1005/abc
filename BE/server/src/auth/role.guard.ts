import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy danh sách các roles từ metadata
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!roles) {
      return true; // Nếu không có roles nào được gán, cho phép truy cập
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Kiểm tra nếu user không tồn tại hoặc không có role
    if (!user || !user.role) {
      return false;
    }

    // Kiểm tra role của user có nằm trong danh sách roles được yêu cầu không
    return roles.includes(user.role);
  }
}
