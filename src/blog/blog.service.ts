import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  private makeSlug(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  async create(dto: CreateBlogDto) {
    const slug = dto.slug?.trim() || this.makeSlug(dto.title);

    return this.prisma.blog.create({
      data: {
        title: dto.title,
        slug,
        excerpt: dto.excerpt,
        content: dto.content,
        imageUrl: dto.imageUrl || null,
        category: dto.category,
        tags: dto.tags || null,
        metaTitle: dto.metaTitle || dto.title,
        metaDesc: dto.metaDesc || dto.excerpt,
        isPublished: dto.isPublished ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.blog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findPublished() {
    return this.prisma.blog.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async findBySlug(slug: string) {
    const blog = await this.prisma.blog.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async update(id: string, dto: UpdateBlogDto) {
    await this.findOne(id);

    const slug = dto.slug?.trim()
      ? dto.slug.trim()
      : dto.title
        ? this.makeSlug(dto.title)
        : undefined;

    return this.prisma.blog.update({
      where: { id },
      data: {
        title: dto.title,
        slug,
        excerpt: dto.excerpt,
        content: dto.content,
        imageUrl: dto.imageUrl,
        category: dto.category,
        tags: dto.tags,
        metaTitle: dto.metaTitle,
        metaDesc: dto.metaDesc,
        isPublished: dto.isPublished,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.blog.delete({
      where: { id },
    });
  }
}
