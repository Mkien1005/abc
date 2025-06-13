import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCartDto, CartResponseDto } from '../dto/create-cart.dto';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createCart(createCartDto: CreateCartDto): Promise<CartResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: createCartDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User với ID ${createCartDto.userId} không tồn tại`,
      );
    }

    const newCart = this.cartRepository.create({ user });
    await this.cartRepository.save(newCart);
    return this.toCartResponseDto(newCart);
  }

  async getCartById(id: string): Promise<CartResponseDto> {
    const cart = await this.cartRepository.findOne({
      where: {
        id,
      },
      relations: ['user', 'cartDetails', 'cartDetails.product'],
    });
    if (!cart) {
      throw new NotFoundException(`Giỏ hàng với ID ${id} không tồn tại`);
    }
    return this.toCartResponseDto(cart);
  }

  async deleteCart(id: string): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { id } });

    if (!cart) {
      throw new NotFoundException(`Giỏ hàng với ID ${id} không tồn tại`);
    }

    await this.cartRepository.remove(cart);
  }

  async getAllCarts(): Promise<CartResponseDto[]> {
    const carts = await this.cartRepository.find({
      relations: ['user', 'cartDetails'],
    });
    return carts.map((cart) => this.toCartResponseDto(cart));
  }

  private toCartResponseDto(cart: Cart): CartResponseDto {
    return {
      id: cart.id,
      userId: cart.user.id,
      cartDetails: cart.cartDetails,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }
}
