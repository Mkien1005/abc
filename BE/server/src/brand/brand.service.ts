import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    const newBrand = this.brandRepository.create(createBrandDto);
    return await this.brandRepository.save(newBrand);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Brand>> {
    return await paginate<Brand>(this.brandRepository, options);
  }

  async findOne(id: string) {
    return await this.brandRepository.findOne({ where: { id } });
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    await this.brandRepository.update(id, updateBrandDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.brandRepository.delete(id);
    return { message: `Brand #${id} deleted successfully` };
  }

  async getBrandWithProduct(
    options: IPaginationOptions,
    id: string,
  ): Promise<Pagination<Brand, IPaginationMeta>> {
    const queryBuilder = this.brandRepository
      .createQueryBuilder('brand')
      .where('brand.id = :id', { id })
      .leftJoinAndSelect('brand.products', 'product');
    return await paginate<Brand>(queryBuilder, options);
  }
}
