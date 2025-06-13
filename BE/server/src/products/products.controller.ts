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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { ProductsService } from 'src/products/products.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(RolesGuard)
@Controller('products') // định nghĩA CTL
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles('admin')
  @Post()
  @UseInterceptors(FilesInterceptor('image_url', 10))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() image_url: Express.Multer.File[],
  ) {
    return await this.productsService.create(createProductDto, image_url);
  }
  @Get('/statistics/total')
  async countTotal() {
    return await this.productsService.countTotalProducts();
  }

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('brand') brand?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('name') name?: string,
  ) {
    const currentPage = page ? Number(page) : 1;
    const currentLimit = limit ? Number(limit) : 10;

    const filters = { brand, category, minPrice, maxPrice, name };
    return await this.productsService.findAll(
      { page: currentPage, limit: currentLimit },
      filters,
    );
  }

  @Roles('admin', 'user')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Roles('admin')
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('image_url', 10))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() image_url: Express.Multer.File[],
    @Body('existingImages') existingImages: string,
  ) {
    const existingImagesArray = existingImages
      ? JSON.parse(existingImages)
      : [];
    return await this.productsService.update(
      id,
      updateProductDto,
      image_url,
      existingImagesArray,
    );
  }

  @Roles('admin') //admin mới dc xoá
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(id);
  }
}
