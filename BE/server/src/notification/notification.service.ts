import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { MyMailerService } from '../mail/mailer.service';
import { User } from '../users/entities/user.entity';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MyMailerService,
    private notificationGateway: NotificationGateway,
  ) {}

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: string;
    orderId?: string;
    user?: User;
  }) {
    // Get user email
    const user = await this.userRepository.findOne({
      where: { id: data.userId },
      select: ['email', 'id', 'fullName'],
    });
    data.user = user;
    const notification = this.notificationRepository.create({
      ...data,
      isRead: false,
    });
    await this.notificationRepository.save(notification);

    if (user?.email) {
      // Send email notification
      await this.mailService.sendNotificationEmail({
        to: user.email,
        subject: data.title,
        text: data.message,
        html: '',
      });
    }

    // Send real-time notification
    await this.notificationGateway.sendNotification(data.userId, notification);

    // Update unread count
    const unreadCount = await this.getUnreadCount(data.userId);
    await this.notificationGateway.sendUnreadCount(data.userId, unreadCount);

    return notification;
  }

  async getUserNotifications(userId: string) {
    return this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .select([
        'notification.id',
        'notification.title',
        'notification.message',
        'notification.type',
        'notification.isRead',
        'notification.createdAt',
        'notification.orderId',
        'user.id',
      ])
      .where('user.id = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();
  }

  async markAsRead(notificationId: string) {
    const notification = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .select(['notification.id', 'notification.isRead', 'user.id'])
      .where('notification.id = :id', { id: notificationId })
      .getOne();

    if (notification) {
      notification.isRead = true;
      await this.notificationRepository.save(notification);

      // Update unread count
      const unreadCount = await this.getUnreadCount(notification.user.id);
      await this.notificationGateway.sendUnreadCount(
        notification.user.id,
        unreadCount,
      );
    }
    return notification;
  }

  async markAllAsRead(userId: string) {
    // Find all unread notifications for the user
    const unreadNotifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .select(['notification.id', 'notification.isRead', 'user.id'])
      .where('user.id = :userId', { userId })
      .andWhere('notification.isRead = :isRead', { isRead: false })
      .getMany();

    // Update each notification
    for (const notification of unreadNotifications) {
      notification.isRead = true;
      await this.notificationRepository.save(notification);
    }

    // Update unread count
    await this.notificationGateway.sendUnreadCount(userId, 0);

    return true;
  }

  async getUnreadCount(userId: string) {
    return this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoin('notification.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('notification.isRead = :isRead', { isRead: false })
      .getCount();
  }
}
