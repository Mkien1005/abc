import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OrderStatus } from 'src/order/entities/order.entity';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MyMailerService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendForgotPasswordEmail(email: string, newPassword: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Lấy lại mật khẩu',
        text: `Mật khẩu mới của bạn là: ${newPassword}. Hãy đổi lại mật khẩu sau khi đăng nhập.`,
        html: `<p><strong>Mật khẩu mới của bạn là:</strong> <span style="color:blue;">${newPassword}</span></p>
               <p>Vui lòng đăng nhập và đổi lại mật khẩu ngay.</p>`,
      });

      return { success: true, message: 'Mật khẩu mới đã được gửi đến email' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Gửi email thất bại' };
    }
  }

  async sendStatusOrder(data: any) {
    try {
      let subject = 'Thông báo đơn hàng';
      let message = '';

      switch (data.status) {
        case OrderStatus.PENDING:
          message = 'Đơn hàng của bạn đang chờ xác nhận.';
          break;
        case OrderStatus.CONFIRMED:
          message = 'Đơn hàng của bạn đã được xác nhận.';
          break;
        case OrderStatus.PROCESSING:
          message = 'Đơn hàng của bạn đang được xử lý.';
          break;
        case OrderStatus.SHIPPED:
          message = 'Đơn hàng của bạn đã được giao cho đơn vị vận chuyển.';
          break;
        case OrderStatus.DELIVERED:
          message = 'Đơn hàng của bạn đã được giao thành công.';
          break;
        case OrderStatus.CANCELLED:
          message = 'Đơn hàng của bạn đã bị hủy.';
          break;
        default:
          message = 'Tình trạng đơn hàng không xác định.';
      }

      await this.mailerService.sendMail({
        to: data.email,
        subject: subject,
        text: `${message} Mô tả: ${data.description}.`,
        html: `<p>Xin chào ${data.fullName}</p>
               <p><strong>${message} Vui lòng vào trang chủ của chúng tôi để xem thông tin chi tiết <a href="https://pharmacy-manager-4lkv.vercel.app/">tại đây.</a></strong></p>
               <p>Mô tả: ${data.description}</p>`,
      });

      return {
        success: true,
        message: 'Thông báo đơn hàng đã được gửi đến email',
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Gửi email thất bại' };
    }
  }

  async sendLowStockAlert(
    product: { id: string; name: string; quantity: number },
    threshold: number = 10,
  ) {
    const adminEmail = this.configService.get('ADMIN_EMAIL');
    console.log('send email', adminEmail);
    try {
      const subject = `Cảnh báo: Sản phẩm ${product.name} sắp hết hàng`;
      const message = `Sản phẩm ${product.name} (ID: ${product.id}) chỉ còn ${product.quantity} đơn vị trong kho, thấp hơn ngưỡng ${threshold}. Vui lòng kiểm tra và nhập thêm hàng.`;

      await this.mailerService.sendMail({
        to: adminEmail,
        subject: subject,
        text: message,
        html: `
          <p><strong>Cảnh báo tồn kho thấp</strong></p>
          <p>Sản phẩm: <strong>${product.name}</strong> (ID: ${product.id})</p>
          <p>Số lượng còn lại: <strong>${product.quantity}</strong></p>
          <p>Vui lòng kiểm tra và nhập thêm hàng tại <a href="http://localhost:3002/">trang quản lý</a>.</p>
        `,
      });

      return {
        success: true,
        message: `Email cảnh báo tồn kho thấp cho sản phẩm ${product.name} đã được gửi đến ${adminEmail}`,
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Gửi email cảnh báo tồn kho thất bại' };
    }
  }

  async sendOutOfStockAlert(product: { id: string; name: string }) {
    const adminEmail = this.configService.get('ADMIN_EMAIL');
    try {
      const subject = `Cảnh báo: Sản phẩm ${product.name} đã hết hàng`;
      const message = `Sản phẩm ${product.name} (ID: ${product.id}) đã hết hàng trong kho. Vui lòng nhập thêm hàng để tiếp tục kinh doanh.`;

      await this.mailerService.sendMail({
        to: adminEmail,
        subject: subject,
        text: message,
        html: `
          <p><strong>Cảnh báo hết hàng</strong></p>
          <p>Sản phẩm: <strong>${product.name}</strong> (ID: ${product.id})</p>
          <p>Số lượng trong kho: <strong>0</strong></p>
          <p>Vui lòng nhập thêm hàng tại <a href="http://localhost:3002/">trang quản lý</a>.</p>
        `,
      });

      return {
        success: true,
        message: `Email cảnh báo hết hàng cho sản phẩm ${product.name} đã được gửi đến ${adminEmail}`,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Gửi email cảnh báo hết hàng thất bại',
      };
    }
  }

  async sendNotificationEmail(data: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    await this.mailerService.sendMail(data);
  }
}
