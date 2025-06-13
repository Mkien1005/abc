import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import {
  CreateCartDetailDto,
  CartDetailResponseDto,
  UpdateCartDetailDto,
} from '../dto/cart-detail.dto';
import { CartDetail } from '../entities/cart-detail.entity';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class CartDetailService {
  constructor(
    @InjectRepository(CartDetail)
    private readonly cartDetailRepo: Repository<CartDetail>,
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createCartDetail(
    createCartDetailDto: CreateCartDetailDto,
  ): Promise<CartDetailResponseDto> {
    const cart = await this.cartRepo.findOne({
      where: { id: createCartDetailDto.cartId },
    });
    if (!cart) {
      throw new NotFoundException(
        `Giỏ hàng với ID ${createCartDetailDto.cartId} không tồn tại`,
      );
    }
    const product = await this.productRepo.findOne({
      where: { id: createCartDetailDto.productId },
    });
    if (!product) {
      throw new NotFoundException(
        `Sản phẩm với ID ${createCartDetailDto.productId} không tồn tại`,
      );
    }
    const productExitInCart = await this.cartDetailRepo.findOne({
      where: { product: { id: product.id }, cart: { id: cart.id } },
      relations: ['cart', 'product'],
    });
    if (productExitInCart) {
      productExitInCart.quantity += createCartDetailDto.quantity;
      await this.cartDetailRepo.save(productExitInCart);
      return this.toCartDetailResponseDto(productExitInCart);
    }
    const cartDetail = this.cartDetailRepo.create({
      ...createCartDetailDto,
      cart,
      product,
    });
    await this.cartDetailRepo.save(cartDetail);
    return this.toCartDetailResponseDto(cartDetail);
  }

  async getCartDetailById(id: string): Promise<CartDetailResponseDto> {
    const cartDetail = await this.cartDetailRepo.findOne({
      where: { id },
      relations: ['cart', 'product'],
    });

    if (!cartDetail) {
      throw new NotFoundException(
        `Chi tiết giỏ hàng với ID ${id} không tồn tại`,
      );
    }

    return this.toCartDetailResponseDto(cartDetail);
  }

  async deleteCartDetail(id: string): Promise<void> {
    const cartDetail = await this.cartDetailRepo.findOne({ where: { id } });

    if (!cartDetail) {
      throw new NotFoundException(
        `Chi tiết giỏ hàng với ID ${id} không tồn tại`,
      );
    }

    await this.cartDetailRepo.remove(cartDetail);
  }

  async getAllCartDetails(): Promise<CartDetailResponseDto[]> {
    const cartDetails = await this.cartDetailRepo.find({
      relations: ['cart', 'product'],
    });
    return cartDetails.map((cd) => this.toCartDetailResponseDto(cd));
  }

  async updateCartDetail(id: string, cartDetail: UpdateCartDetailDto) {
    const existingCartDetail = await this.cartDetailRepo.findOne({
      where: { id },
    });
    if (!existingCartDetail) {
      throw new NotFoundException(
        `Chi tiết giỏ hàng với ID ${id} không tồn tại`,
      );
    }
    existingCartDetail.quantity = cartDetail.quantity;
    await this.cartDetailRepo.save(existingCartDetail);
  }
  private toCartDetailResponseDto(
    cartDetail: CartDetail,
  ): CartDetailResponseDto {
    return {
      id: cartDetail.id,
      cartId: cartDetail.cart.id,
      product: cartDetail.product,
      quantity: cartDetail.quantity,
      createdAt: cartDetail.createdAt,
      updatedAt: cartDetail.updatedAt,
    };
  }
}
