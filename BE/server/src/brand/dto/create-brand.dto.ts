// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên thương hiệu không được để trống.' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
