import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateInventoryImportDto } from './dto/create-import.dto';
import { UpdateInventoryImportDto } from './dto/update-import.dto';
import { InventoryImport } from './import.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class InventoryImportsService {
  constructor(
    @InjectRepository(InventoryImport)
    private importRepo: Repository<InventoryImport>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(createDto: CreateInventoryImportDto): Promise<InventoryImport> {
    const product = await this.productRepo.findOne({
      where: { id: createDto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const newImport = this.importRepo.create(createDto);
    await this.importRepo.save(newImport);

    product.stock += createDto.quantity;
    await this.productRepo.save(product);

    return newImport;
  }

  async findAll(options: IPaginationOptions) {
    const queryBuilder = this.importRepo
      .createQueryBuilder('inventory_imports')
      .leftJoinAndSelect('inventory_imports.product', 'product');
    return await paginate<InventoryImport>(queryBuilder, options);
  }

  async findOne(id: string): Promise<InventoryImport> {
    const importRecord = await this.importRepo.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!importRecord) throw new NotFoundException('Import record not found');
    return importRecord;
  }

  async update(
    id: string,
    updateDto: UpdateInventoryImportDto,
  ): Promise<InventoryImport> {
    const importRecord = await this.findOne(id);
    const oldQuantity = importRecord.quantity;

    Object.assign(importRecord, updateDto);
    await this.importRepo.save(importRecord);

    if (
      updateDto.quantity !== undefined &&
      updateDto.quantity !== oldQuantity
    ) {
      const product = await this.productRepo.findOne({
        where: { id: importRecord.productId },
      });
      if (!product) throw new NotFoundException('Product not found');
      product.stock = product.stock - oldQuantity + updateDto.quantity;
      await this.productRepo.save(product);
    }

    return importRecord;
  }

  async remove(id: string): Promise<void> {
    const importRecord = await this.findOne(id);
    const product = await this.productRepo.findOne({
      where: { id: importRecord.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    product.stock -= importRecord.quantity;
    await this.productRepo.save(product);

    await this.importRepo.remove(importRecord);
  }
}
