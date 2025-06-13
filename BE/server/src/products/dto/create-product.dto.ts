import { Type } from 'class-transformer';
import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsString,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Danh mục không được để trống.' })
  category_id: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Thương hiệu không được để trống.' })
  brand_id: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống.' })
  name: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Giá sản phẩm không được để trống.' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'Mô tả không được để trống.' })
  description: string;

  @IsOptional()
  @IsArray()
  images: Express.Multer.File[];

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Số lượng tồn kho không được để trống.' })
  stock: number;

  @IsOptional()
  @IsString()
  usage_instructions?: string;

  @IsOptional()
  @IsString()
  contraindications?: string;

  @Type(() => Boolean)
  @IsBoolean()
  @IsNotEmpty({ message: 'Trạng thái nổi bật không được để trống.' })
  is_featured: boolean;

  @IsOptional()
  @IsEnum(['active', 'inactive'], {
    message: 'Trạng thái phải là "active" hoặc "inactive".',
  })
  status?: 'active' | 'inactive';
}
