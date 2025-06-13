import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CreateInventoryImportDto } from './dto/create-import.dto';
import { UpdateInventoryImportDto } from './dto/update-import.dto';
import { InventoryImport } from './import.entity';
import { InventoryImportsService } from './import.service';

@Controller('inventory-imports')
export class InventoryImportsController {
  constructor(private readonly service: InventoryImportsService) {}

  @Post()
  create(
    @Body() createDto: CreateInventoryImportDto,
  ): Promise<InventoryImport> {
    return this.service.create(createDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const currentPage = page ? Number(page) : 1;
    const currentLimit = limit ? Number(limit) : 10;
    return this.service.findAll({
      page: currentPage,
      limit: currentLimit,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string): Promise<InventoryImport> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateDto: UpdateInventoryImportDto,
  ): Promise<InventoryImport> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string): Promise<void> {
    return this.service.remove(id);
  }
}
