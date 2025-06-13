import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { InventoryImport } from './import.entity';
import { InventoryImportsController } from './import.controller';
import { InventoryImportsService } from './import.service';
@Module({
  imports: [TypeOrmModule.forFeature([InventoryImport, Product])],
  providers: [InventoryImportsService],
  controllers: [InventoryImportsController],
})
export class InventoryImportsModule {}
