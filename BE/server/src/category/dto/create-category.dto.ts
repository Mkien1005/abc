import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên loại thuốc không được để trống.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Mô tả không được để trống.' })
  description: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
