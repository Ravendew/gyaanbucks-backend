import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  ReorderCategoryDto,
  UpdateCategoryDto,
} from './create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AdminAuthGuard)
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('active')
  findActive() {
    return this.categoryService.findActive();
  }

  @UseGuards(AdminAuthGuard)
  @Post('reorder')
  reorder(@Body() dto: ReorderCategoryDto) {
    return this.categoryService.reorder(dto);
  }

  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
