import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsUUID('4', { message: 'ID người dùng không hợp lệ' })
  @IsNotEmpty({ message: 'ID người dùng không được để trống' })
  userId: string;
}
export class CartResponseDto {
  id: string;
  userId: string;
  cartDetails: any;
  createdAt: Date;
  updatedAt: Date;
}
