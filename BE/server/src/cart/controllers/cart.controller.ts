import { Controller, Get, Req } from '@nestjs/common';
import { CartResponseDto } from '../dto/create-cart.dto';
import { CartService } from '../services/cart.service';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCartById(@Req() req: any): Promise<CartResponseDto> {
    const id = req.user.cartId;
    return await this.cartService.getCartById(id);
  }
}
