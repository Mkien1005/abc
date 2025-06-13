import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class CreateCartDetailDto {
  cartId: string;

  @IsUUID('4', { message: 'ID sản phẩm không hợp lệ' })
  @IsNotEmpty({ message: 'ID sản phẩm không được để trống' })
  productId: string;

  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  quantity: number;
}

export class UpdateCartDetailDto {
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  quantity: number;
}

export class CartDetailResponseDto {
  id: string;
  cartId: string;
  product: Object;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
