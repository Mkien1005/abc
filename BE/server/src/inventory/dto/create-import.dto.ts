import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsNumber,
  IsPositive,
  IsInt,
} from 'class-validator';

export class CreateInventoryImportDto {
  @IsString({ message: 'Sản phẩm phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Sản phẩm không được để trống' })
  productId: string;

  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @IsPositive({ message: 'Số lượng phải là số dương' })
  @IsNotEmpty({ message: 'Số lượng không được để trống' })
  quantity: number;

  @IsNumber({}, { message: 'Giá nhập phải là chuỗi số' })
  @IsPositive({ message: 'Số lượng phải là số dương' })
  @IsNotEmpty({ message: 'Giá nhập không được để trống' })
  cost: number;

  @IsString({ message: 'Tên thương hiệu phải là chuỗi ký tự' })
  @IsOptional()
  brandName?: string;

  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @IsOptional()
  note?: string;
}
