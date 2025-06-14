import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CloudinaryService } from 'src/common/config/cloudinary.config';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    private cloudinaryService: CloudinaryService,
  ) {}
  async countTotalProducts(): Promise<number> {
    return this.productRepository.count();
  }

  async create(
    createProductDto: CreateProductDto,
    image_url: Express.Multer.File[],
  ): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.category_id },
    });
    if (!category) throw new NotFoundException('Danh mục không tồn tại.');

    const brand = await this.brandRepository.findOne({
      where: { id: createProductDto.brand_id },
    });
    if (!brand) throw new NotFoundException('Thương hiệu không tồn tại.');
    const imageUrls = [];
    if (image_url && image_url.length > 0) {
      for (const image of image_url) {
        const imageUrl = await this.cloudinaryService.uploadImage(image);
        imageUrls.push(imageUrl);
      }
    }
    const product = this.productRepository.create({
      ...createProductDto,
      category,
      brand,
      image_url: imageUrls,
    });
    return await this.productRepository.save(product);
  }

  async findAll(
    options: IPaginationOptions,
    filters: any,
  ): Promise<Pagination<Product>> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand');

    if (filters && filters.brand) {
      queryBuilder.andWhere('brand.id = :brand', { brand: filters.brand });
    }

    if (filters && filters.category) {
      queryBuilder.andWhere('category.id = :category', {
        category: filters.category,
      });
    }

    if (filters && filters.minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters && filters.maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    // 💡 Tìm kiếm theo tên sản phẩm (LIKE %tên%)
    if (filters && filters.name) {
      queryBuilder.andWhere('product.name LIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    return paginate<Product>(queryBuilder, options);
  }

  async findOne(id: string): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'brand'],
    });
    if (!product) {
      throw new NotFoundException(`Sản phẩm với ID ${id} không tìm thấy.`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    newImages: Express.Multer.File[],
    existingImages: string[],
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại.');

    if (updateProductDto.category_id) {
      product.category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.category_id },
      });
    }

    if (updateProductDto.brand_id) {
      product.brand = await this.brandRepository.findOne({
        where: { id: updateProductDto.brand_id },
      });
    }
    const imageUrls = [...existingImages];

    if (newImages && newImages.length > 0) {
      for (const image of newImages) {
        const imageUrl = await this.cloudinaryService.uploadImage(image);
        imageUrls.push(imageUrl);
      }
    }

    product.image_url = imageUrls;

    return await this.productRepository.save({
      ...product,
      ...updateProductDto,
    });
  }

  async remove(id: string): Promise<Boolean> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Sản phẩm với ID ${id} không tìm thấy.`);
    } else return true;
  }
}
