import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
  Patch,
} from '@nestjs/common';
import {
  CreateCartDetailDto,
  CartDetailResponseDto,
  UpdateCartDetailDto,
} from '../dto/cart-detail.dto';
import { CartDetailService } from '../services/cart-detail.service';
@Controller('cart-details')
export class CartDetailController {
  constructor(private readonly cartDetailService: CartDetailService) {}

  @Post()
  async createCartDetail(
    @Body() createCartDetailDto: CreateCartDetailDto,
    @Req() req: any,
  ): Promise<CartDetailResponseDto> {
    const cartId = req.user.cartId;
    createCartDetailDto.cartId = cartId;
    console.log('cartId :>> ', cartId);
    return await this.cartDetailService.createCartDetail(createCartDetailDto);
  }

  @Get(':id')
  async getCartDetailById(
    @Param('id') id: string,
  ): Promise<CartDetailResponseDto> {
    return await this.cartDetailService.getCartDetailById(id);
  }

  @Delete(':id')
  async deleteCartDetail(@Param('id') id: string): Promise<void> {
    return await this.cartDetailService.deleteCartDetail(id);
  }

  @Patch(':id')
  async updateCartDetail(
    @Param('id') id: string,
    @Body() updateCartDetailDto: UpdateCartDetailDto,
  ) {
    return await this.cartDetailService.updateCartDetail(
      id,
      updateCartDetailDto,
    );
  }

  @Get()
  async getAllCartDetails(): Promise<CartDetailResponseDto[]> {
    return this.cartDetailService.getAllCartDetails();
  }
}
