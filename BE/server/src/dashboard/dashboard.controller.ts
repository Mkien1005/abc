import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }

  @Get('revenue')
  async getRevenueStats() {
    return this.dashboardService.getRevenueStats();
  }

  @Get('customers')
  async getCustomerStats() {
    return this.dashboardService.getCustomerStats();
  }

  @Get('orders')
  async getOrderStats() {
    return this.dashboardService.getOrderStats();
  }

  @Get('products')
  async getProductStats() {
    return this.dashboardService.getProductStats();
  }

  @Get('monthly')
  async getMonthlyStats() {
    return this.dashboardService.getMonthlyStats();
  }

  @Get('categories')
  async getCategoryStats() {
    return this.dashboardService.getProductTypeStats();
  }

  @Get('top-products')
  async getTopProducts() {
    return this.dashboardService.getTopProducts();
  }
}
