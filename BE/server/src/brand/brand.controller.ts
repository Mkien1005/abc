import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
@UseGuards(RolesGuard)
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Roles('admin', 'user')
  @Get('product/:id')
  async getBrandWithProduct(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Param('id') id: string,
  ) {
    return await this.brandService.getBrandWithProduct({ page, limit }, id);
  }

  @Roles('admin')
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Roles('admin', 'user')
  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const currentPage = page ? Number(page) : 1;
    const currentLimit = limit ? Number(limit) : 10;
    return this.brandService.findAll({
      page: currentPage,
      limit: currentLimit,
    });
  }

  @Roles('admin', 'user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
