import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../entities/order.entity';

export class CreateOrderDetailDto {
  @IsOptional()
  cartDetailId: string;

  @IsString({ message: 'ID sản phẩm không hợp lệ' })
  productId: string;

  @IsNumber({}, { message: 'Số lượng phải là số' })
  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  quantity: number;
}

export class CreateOrderDto {
  @IsString({ message: 'Địa chỉ giao hàng không hợp lệ' })
  @IsNotEmpty({ message: 'Địa chỉ giao hàng không được để trống' })
  shippingAddress: string;

  @IsEnum(PaymentMethod, { message: 'Phương thức thanh toán không hợp lệ' })
  paymentMethod: PaymentMethod;

  @IsArray({ message: 'Danh sách sản phẩm không hợp lệ' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  orderDetails: CreateOrderDetailDto[];

  @IsString({ message: 'Ghi chú không hợp lệ' })
  @IsOptional()
  notes?: string;
}

export class ProductDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) => parseFloat(value))
  price: number;
}

export class OrderDetailDto {
  @Expose()
  productId: string;

  @Expose()
  quantity: number;

  @Expose()
  @Transform(({ value }) => parseFloat(value))
  subtotal: number;

  @Expose()
  @Type(() => ProductDto) // ✅ Thêm ProductDto
  product: ProductDto;

  @Exclude() // Loại bỏ thuộc tính order để tránh vòng lặp
  order?: any;
}
export class UserDto {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;
}
export class OrderDto {
  @Expose()
  id: string;

  @Expose()
  @Transform(({ value }) => parseFloat(value))
  totalAmount: number;

  @Expose()
  shippingAddress: string;

  @Expose()
  shippingPhone: string;

  @Expose()
  paymentMethod: string;

  @Expose()
  paymentStatus: string;

  @Expose()
  status: string;

  @Expose()
  notes: string;

  @Expose()
  @Type(() => OrderDetailDto)
  orderDetails: OrderDetailDto[];

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
