import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCategoryDto,
  ReorderCategoryDto,
  UpdateCategoryDto,
} from './create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const lastCategory = await this.prisma.category.findFirst({
      orderBy: [{ position: 'desc' }, { createdAt: 'desc' }],
    });

    return this.prisma.category.create({
      data: {
        name: dto.name.trim(),
        icon: dto.icon?.trim() || '📚',
        description: dto.description?.trim() || '',
        position: dto.position ?? (lastCategory?.position ?? 0) + 1,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    });
  }

  findActive() {
    return this.prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.icon !== undefined ? { icon: dto.icon.trim() || '📚' } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description.trim() }
          : {}),
        ...(dto.position !== undefined
          ? { position: Number(dto.position) }
          : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });
  }

  async reorder(dto: ReorderCategoryDto) {
    if (!dto.items || !Array.isArray(dto.items) || dto.items.length === 0) {
      throw new BadRequestException('Items are required');
    }

    return this.prisma.$transaction(
      dto.items.map((item, index) =>
        this.prisma.category.update({
          where: { id: item.id },
          data: {
            position:
              Number.isFinite(Number(item.position)) &&
              Number(item.position) > 0
                ? Number(item.position)
                : index + 1,
          },
        }),
      ),
    );
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
