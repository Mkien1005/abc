import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { OrderDetail } from '../order/entities/order-detail.entity';
import { Product } from '../products/entities/product.entity';
import { OrderStatus } from '../order/entities/order.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private getDateRange() {
    const now = new Date();

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    currentMonthEnd.setHours(23, 59, 59, 999);

    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    previousMonthEnd.setHours(23, 59, 59, 999);

    return {
      currentMonthStart,
      currentMonthEnd,
      previousMonthStart,
      previousMonthEnd,
    };
  }

  async getDashboardStats() {
    const {
      currentMonthStart,
      currentMonthEnd,
      previousMonthStart,
      previousMonthEnd,
    } = this.getDateRange();

    const [
      currentMonthRevenue,
      previousMonthRevenue,
      newCustomers,
      totalOrders,
      bestSellingProduct,
      monthlyStats,
      productTypeStats,
      customerGrowthStats,
      topProducts,
    ] = await Promise.all([
      this.calculateRevenue(currentMonthStart, currentMonthEnd),
      this.calculateRevenue(previousMonthStart, previousMonthEnd),
      this.getNewCustomers(currentMonthStart, currentMonthEnd),
      this.getTotalOrders(currentMonthStart, currentMonthEnd),
      this.getBestSellingProduct(currentMonthStart, currentMonthEnd),
      this.getMonthlyStats(),
      this.getProductTypeStats(),
      this.getCustomerGrowthStats(),
      this.getTopProducts(),
    ]);

    const revenueChangePercentage =
      previousMonthRevenue === 0
        ? 100
        : ((currentMonthRevenue - previousMonthRevenue) /
            previousMonthRevenue) *
          100;

    return {
      revenue: {
        amount: currentMonthRevenue,
        changePercentage: revenueChangePercentage,
      },
      newCustomers,
      orders: totalOrders,
      bestSellingProduct,
      charts: {
        monthlyStats,
        productTypeStats,
        customerGrowthStats,
        topProducts,
      },
    };
  }

  async getRevenueStats() {
    const {
      currentMonthStart,
      currentMonthEnd,
      previousMonthStart,
      previousMonthEnd,
    } = this.getDateRange();

    const [currentMonthRevenue, previousMonthRevenue] = await Promise.all([
      this.calculateRevenue(currentMonthStart, currentMonthEnd),
      this.calculateRevenue(previousMonthStart, previousMonthEnd),
    ]);

    const changePercentage =
      previousMonthRevenue === 0
        ? 100
        : ((currentMonthRevenue - previousMonthRevenue) /
            previousMonthRevenue) *
          100;

    return {
      amount: currentMonthRevenue,
      changePercentage,
    };
  }

  async getCustomerStats() {
    const { currentMonthStart, currentMonthEnd } = this.getDateRange();
    const newCustomers = await this.getNewCustomers(
      currentMonthStart,
      currentMonthEnd,
    );
    const customerGrowthStats = await this.getCustomerGrowthStats();

    return {
      newCustomers,
      growthStats: customerGrowthStats,
    };
  }

  async getOrderStats() {
    const { currentMonthStart, currentMonthEnd } = this.getDateRange();
    const totalOrders = await this.getTotalOrders(
      currentMonthStart,
      currentMonthEnd,
    );
    return {
      totalOrders,
    };
  }

  async getProductStats() {
    const { currentMonthStart, currentMonthEnd } = this.getDateRange();
    const bestSellingProduct = await this.getBestSellingProduct(
      currentMonthStart,
      currentMonthEnd,
    );
    const topProducts = await this.getTopProducts();

    return {
      bestSellingProduct,
      topProducts,
    };
  }

  private async calculateRevenue(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [OrderStatus.PENDING, OrderStatus.CANCELLED],
      })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne();

    return Number(result?.total) || 0;
  }

  private async getNewCustomers(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return this.userRepository.count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });
  }

  private async getTotalOrders(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return this.orderRepository.count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });
  }

  private async getBestSellingProduct(
    startDate: Date,
    endDate: Date,
  ): Promise<string> {
    const result = await this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .select('product.name', 'productName')
      .addSelect('SUM(orderDetail.quantity)', 'totalQuantity')
      .innerJoin('orderDetail.product', 'product')
      .innerJoin('orderDetail.order', 'order')
      .where('order.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [OrderStatus.PENDING, OrderStatus.CANCELLED],
      })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('product.id')
      .orderBy('totalQuantity', 'DESC')
      .limit(1)
      .getRawOne();

    return result?.productName || 'Không có dữ liệu';
  }

  async getMonthlyStats(): Promise<number[]> {
    const currentYear = new Date().getFullYear();
    const stats: number[] = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);
      endDate.setHours(23, 59, 59, 999);

      const revenue = await this.calculateRevenue(startDate, endDate);
      stats.push(revenue);
    }

    return stats;
  }

  async getProductTypeStats() {
    const result = await this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .innerJoin('orderDetail.product', 'product')
      .innerJoin('product.category', 'category')
      .innerJoin('orderDetail.order', 'order')
      .select('category.name', 'type')
      .addSelect('COUNT(DISTINCT orderDetail.productId)', 'count')
      .where('order.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [OrderStatus.PENDING, OrderStatus.CANCELLED],
      })
      .groupBy('category.name')
      .getRawMany();

    return result.map((stat) => ({
      type: stat.type || 'Không phân loại',
      count: parseInt(stat.count, 10),
    }));
  }

  async getCustomerGrowthStats(): Promise<number[]> {
    const currentYear = new Date().getFullYear();
    const stats: number[] = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);
      endDate.setHours(23, 59, 59, 999);

      const count = await this.getNewCustomers(startDate, endDate);
      stats.push(count);
    }

    return stats;
  }

  async getTopProducts() {
    return this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .select('product.name', 'name')
      .addSelect('SUM(orderDetail.quantity)', 'sales')
      .addSelect('SUM(orderDetail.quantity * orderDetail.subtotal)', 'revenue')
      .innerJoin('orderDetail.product', 'product')
      .innerJoin('orderDetail.order', 'order')
      .where('order.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [OrderStatus.PENDING, OrderStatus.CANCELLED],
      })
      .groupBy('product.id')
      .orderBy('sales', 'DESC')
      .limit(5)
      .getRawMany();
  }
}
