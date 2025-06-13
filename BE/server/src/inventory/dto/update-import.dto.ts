import {
  IsInt,
  IsPositive,
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateInventoryImportDto {
  @IsString({ message: 'Sản phẩm phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Sản phẩm không được để trống' })
  productId?: string;

  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @IsPositive({ message: 'Số lượng phải là số dương' })
  quantity?: number;

  @IsNumber({}, { message: 'Giá nhập phải là số' })
  @IsPositive({ message: 'Giá nhập phải là số dương' })
  cost?: number;

  @IsString({ message: 'Tên thương hiệu phải là chuỗi ký tự' })
  @IsOptional()
  brandName?: string;

  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @IsOptional()
  note?: string;
}
