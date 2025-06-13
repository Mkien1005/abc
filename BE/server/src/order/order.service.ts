import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  CreateOrderDetailDto,
  CreateOrderDto,
  OrderDto,
} from './dto/create-order.dto';
import {
  UpdateOrderAdminDto,
  UpdateOrderUserDto,
} from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { MyMailerService } from 'src/mail/mailer.service';
import { OrderDetail } from './entities/order-detail.entity';
import { Product } from 'src/products/entities/product.entity';
import { plainToInstance } from 'class-transformer';
import * as crypto from 'crypto';
import * as querystring from 'qs';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';
import { CartDetail } from 'src/cart/entities/cart-detail.entity';
import { Between } from 'typeorm';
import { OrderStatus } from './entities/order.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailerService: MyMailerService,
    @InjectRepository(CartDetail)
    private readonly cartDetailRepository: Repository<CartDetail>,
    private readonly notificationService: NotificationService,
  ) {}

  // ...
  async createOrder(createOrderDto: CreateOrderDto, userId?: string) {
    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    const { orderDetails, ...rest } = createOrderDto;

    // Lấy danh sách sản phẩm từ DB
    const productIds = orderDetails.map((item) => item.productId);
    const products = await this.productRepository.find({
      where: { id: In(productIds) },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Một số sản phẩm không tồn tại');
    }

    // Tạo map để truy xuất nhanh giá sản phẩm
    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    // Kiểm tra số lượng tồn kho trước khi tạo đơn hàng
    for (const item of orderDetails) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new NotFoundException(`Sản phẩm ${item.productId} không tồn tại`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Sản phẩm ${product.name} không đủ số lượng trong kho. Còn lại: ${product.stock}`,
        );
      }
    }

    // Tính tổng tiền và tạo danh sách orderDetails
    let totalAmount = 0;
    const orderDetailEntities = orderDetails.map((item) => {
      const product = productMap.get(item.productId);
      const price = product.price;
      const subtotal = item.quantity * price;
      totalAmount += subtotal;

      return this.orderDetailRepository.create({
        order: null,
        product,
        quantity: item.quantity,
        subtotal,
      });
    });

    // Tạo và lưu Order
    const newOrder = this.orderRepository.create({
      user,
      totalAmount,
      ...rest,
    });
    const savedOrder = await this.orderRepository.save(newOrder);

    // Cập nhật số lượng tồn kho
    for (const item of orderDetails) {
      const product = productMap.get(item.productId);
      product.stock -= item.quantity; // Trừ số lượng trong kho
      await this.productRepository.save(product); // Lưu cập nhật vào DB
      if (product.stock <= 20) {
        await this.mailerService.sendLowStockAlert(
          {
            id: product.id,
            name: product.name,
            quantity: product.stock,
          },
          20,
        );
      }
      if (product.stock <= 0) {
        await this.mailerService.sendOutOfStockAlert({
          id: product.id,
          name: product.name,
        });
      }
    }

    // Gán order ID cho orderDetails rồi lưu
    orderDetailEntities.forEach((detail) => (detail.order = savedOrder));
    await this.orderDetailRepository.save(orderDetailEntities);

    // Xóa cartDetail nếu có
    await Promise.all(
      createOrderDto.orderDetails.map(async (item: CreateOrderDetailDto) => {
        if (item.cartDetailId) {
          await this.cartDetailRepository.delete({ id: item.cartDetailId });
        }
      }),
    );

    // Lấy thông tin đơn hàng với chi tiết
    const savedOrderWithDetails = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['orderDetails', 'orderDetails.product'],
    });
    // Create notification for order creation
    await this.notificationService.createNotification({
      userId: savedOrder.user.id,
      title: 'Đặt hàng thành công',
      message: `Đơn hàng #${savedOrder.id} của bạn đã được tạo thành công. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.`,
      type: 'ORDER_CREATED',
      orderId: savedOrder.id,
    });

    return plainToInstance(OrderDto, savedOrderWithDetails, {
      excludeExtraneousValues: true,
    });
  }

  async getOrderById(id: string, userId?: string) {
    let order: Order;

    if (userId) {
      order = await this.orderRepository.findOne({
        where: { id, user: { id: userId } },
        relations: ['user', 'orderDetails', 'orderDetails.product'], // ✅ Thêm product
      });
    } else {
      order = await this.orderRepository.findOne({
        where: { id },
        relations: ['user', 'orderDetails', 'orderDetails.product'], // ✅ Thêm product
      });
    }

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return plainToInstance(OrderDto, order, { excludeExtraneousValues: true });
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderUserDto,
    userId?: string,
  ) {
    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`Không tìm thấy user`);
      }
      const check = await this.orderRepository.findOne({
        where: {
          id,
          user: {
            id: userId,
          },
        },
      });
      if (!check) {
        throw new NotFoundException(`Không tìm thấy đơn hàng với ID là ${id}`);
      }
    }
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    Object.assign(order, updateOrderDto);
    await this.orderRepository.save(order);

    return plainToInstance(OrderDto, order, { excludeExtraneousValues: true });
  }

  async updateOrderAdmin(id: string, updateOrderDto: UpdateOrderAdminDto) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    Object.assign(order, updateOrderDto);
    await this.orderRepository.save(order);

    if (updateOrderDto.status) {
      const data = {
        email: order.user.email,
        fullName: order.user.fullName,
        status: order.status,
      };
      this.mailerService.sendStatusOrder(data);

      // Create notification for order status update
      switch (order.status) {
        case OrderStatus.CONFIRMED:
          await this.notificationService.createNotification({
            userId: order.user.id,
            title: 'Đơn hàng đã được xác nhận',
            message: `Đơn hàng #${order.id} của bạn đã được xác nhận và đang được xử lý.`,
            type: 'ORDER_CONFIRMED',
            orderId: order.id,
          });
          break;

        case OrderStatus.CANCELLED:
          await this.notificationService.createNotification({
            userId: order.user.id,
            title: 'Đơn hàng đã bị hủy',
            message: `Đơn hàng #${order.id} của bạn đã bị hủy.`,
            type: 'ORDER_CANCELLED',
            orderId: order.id,
          });
          break;

        case OrderStatus.SHIPPED:
          await this.notificationService.createNotification({
            userId: order.user.id,
            title: 'Đơn hàng đã được giao',
            message: `Đơn hàng #${order.id} của bạn đã được giao.`,
            type: 'ORDER_SHIPPED',
            orderId: order.id,
          });
          break;

        case OrderStatus.DELIVERED:
          await this.notificationService.createNotification({
            userId: order.user.id,
            title: 'Đơn hàng đã được giao',
            message: `Đơn hàng #${order.id} của bạn đã được giao.`,
            type: 'ORDER_DELIVERED',
            orderId: order.id,
          });
          break;

        case OrderStatus.PROCESSING:
          await this.notificationService.createNotification({
            userId: order.user.id,
            title: 'Đơn hàng đang được xử lý',
            message: `Đơn hàng #${order.id} của bạn đang được xử lý.`,
            type: 'ORDER_PROCESSING',
            orderId: order.id,
          });
          break;

        case OrderStatus.PENDING:
          await this.notificationService.createNotification({
            userId: order.user.id,
            title: 'Đơn hàng đang chờ xử lý',
            message: `Đơn hàng #${order.id} của bạn đang chờ xử lý.`,
            type: 'ORDER_PENDING',
            orderId: order.id,
          });
          break;
      }
    }
    return true;
  }

  async deleteOrder(id: string, userId?: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`Không tìm thấy user có ID là ${userId}`);
      }
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['user', 'orderDetails'],
      });
      if (order.user.id !== userId) {
        throw new ForbiddenException('Bạn không có quyền xóa đơn hàng này');
      }
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      await this.orderDetailRepository.delete({ order: { id: order.id } });

      await this.orderRepository.remove(order);
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllOrders(
    options: IPaginationOptions<IPaginationMeta>,
    userId?: string,
    query?: string,
  ) {
    // sắp xếp theo createdAt
    let queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .distinct(true)
      .orderBy('order.createdAt', 'DESC');

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`Không tìm thấy user có ID là ${userId}`);
      }
      queryBuilder = queryBuilder.where('user.id = :userId', { userId });
    }

    // Thêm điều kiện tìm kiếm nếu có query
    if (query) {
      queryBuilder = queryBuilder.andWhere(
        '(LOWER(user.fullName) LIKE LOWER(:query) OR CAST(order.totalAmount AS CHAR) LIKE :query)',
        { query: `%${query}%` },
      );
    }

    const result = await paginate(queryBuilder, options);
    return {
      ...result,
      items: result.items.map((order) =>
        plainToInstance(OrderDto, order, { excludeExtraneousValues: true }),
      ),
    };
  }
  private vnpUrl =
    process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  private vnpTmnCode = process.env.VNP_TMN_CODE;
  private vnpHashSecret = process.env.VNP_HASH_SECRET;

  async createPaymentUrl(orderId: string, amount: number, returnUrl: string) {
    if (!orderId || !amount || !returnUrl) {
      throw new Error('Thiếu dữ liệu orderId, amount hoặc returnUrl');
    }

    const vnp_ReturnUrl = `${returnUrl}?order_id=${orderId}`;
    const vnp_TxnRef = orderId;
    const vnp_OrderInfo = 'Thanh toán đơn hàng';
    const vnp_OrderType = 'billpayment';
    const vnp_Amount = amount * 100;
    const vnp_Locale = 'vn';
    const vnp_IpAddr = '127.0.0.1';

    const vnp_CreateDate = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14);

    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnpTmnCode,
      vnp_Locale: vnp_Locale,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_OrderType: vnp_OrderType,
      vnp_Amount: vnp_Amount,
      vnp_ReturnUrl: vnp_ReturnUrl,
      vnp_IpAddr: vnp_IpAddr,
      vnp_CreateDate: vnp_CreateDate,
    };

    vnp_Params = Object.fromEntries(Object.entries(vnp_Params).sort());

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', this.vnpHashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl =
      this.vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });

    return {
      code: '00',
      message: 'success',
      data: paymentUrl,
    };
  }

  async getOrderStatsCurrentAndPreviousMonth() {
    const now = new Date();

    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfTwoMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      1,
    );
    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const countTwoMonthsAgo = await this.orderRepository.count({
      where: {
        createdAt: Between(startOfTwoMonthsAgo, startOfPreviousMonth),
      },
    });
    const countPreviousMonth = await this.orderRepository.count({
      where: {
        createdAt: Between(startOfPreviousMonth, startOfCurrentMonth),
      },
    });

    const countCurrentMonth = await this.orderRepository.count({
      where: {
        createdAt: Between(startOfCurrentMonth, startOfNextMonth),
      },
    });
    return {
      count: countCurrentMonth,
      previousMonth: countPreviousMonth,
      twoMonthsAgo: countTwoMonthsAgo,
    };
  }

  async getSuccessfulOrdersSummary(): Promise<{
    totalOrders: number;
    totalAmount: number;
  }> {
    const successfulOrders = await this.orderRepository.find({
      where: { status: OrderStatus.CONFIRMED },
      relations: ['orderDetails', 'orderDetails.product', 'user'],
    });

    const totalOrders = successfulOrders.length;

    const totalAmount = successfulOrders.reduce((sumOrder, order) => {
      return sumOrder + Number(order.totalAmount);
    }, 0);

    return { totalOrders, totalAmount };
  }
}
