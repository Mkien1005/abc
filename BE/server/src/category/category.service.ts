import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/products/entities/category.entity';
import { Repository, UpdateResult } from 'typeorm';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name } = createCategoryDto;
    const categoryExist = await this.categoryRepository.findOne({
      where: { name },
    });
    if (categoryExist) {
      throw new BadRequestException('Loại sản phẩm này đã tồn tại.');
    }
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.findOne(id);
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Không tìm thấy loại sản phẩm này.`);
    }
    return category;
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Category>> {
    return await paginate<Category>(this.categoryRepository, options);
  }

  async findAllWithProduct(
    options: IPaginationOptions,
    id: string,
  ): Promise<Pagination<Category, IPaginationMeta>> {
    //Tìm kiếm với id trả về relation product
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .leftJoinAndSelect('category.products', 'products');
    return await paginate<Category>(queryBuilder, options);
  }

  async remove(id: string): Promise<Boolean> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    } else return true;
  }
}
