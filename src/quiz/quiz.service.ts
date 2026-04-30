import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  private createSlug(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  async create(body: any) {
    const slug = body.slug || this.createSlug(body.title);

    return this.prisma.quiz.create({
      data: {
        slug,
        title: body.title,
        subtitle: body.subtitle,
        category: body.category,
        reward: Number(body.reward ?? 100),
        timeLimit: Number(body.timeLimit ?? 300),
        attemptsPerDay: Number(body.attemptsPerDay ?? 2),
        onlinePlayers: Number(body.onlinePlayers ?? 100),
        isActive: Boolean(body.isActive ?? true),
      },
    });
  }

  async createSampleQuiz() {
    const existing = await this.prisma.quiz.findUnique({
      where: { slug: 'gk-basic' },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.quiz.create({
      data: {
        slug: 'gk-basic',
        title: 'General Knowledge Quiz',
        subtitle: 'Test your basic GK',
        category: 'GK',
        reward: 100,
        timeLimit: 300,
        attemptsPerDay: 2,
        onlinePlayers: 100,
        isActive: true,
        questions: {
          create: [
            {
              question: 'What is the capital of India?',
              optionA: 'Hyderabad',
              optionB: 'New Delhi',
              optionC: 'Mumbai',
              optionD: 'Chennai',
              correctOptionId: 'b',
            },
            {
              question: 'Which planet is Red Planet?',
              optionA: 'Earth',
              optionB: 'Mars',
              optionC: 'Jupiter',
              optionD: 'Venus',
              correctOptionId: 'b',
            },
          ],
        },
      },
      include: {
        questions: true,
      },
    });
  }

  async findAll() {
    return this.prisma.quiz.findMany({
      where: {
        isActive: true,
      },
      include: {
        questions: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findBySlug(slug: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { slug },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }

  async update(id: string, body: any) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return this.prisma.quiz.update({
      where: { id },
      data: {
        slug: body.slug || quiz.slug,
        title: body.title || quiz.title,
        subtitle: body.subtitle || quiz.subtitle,
        category: body.category || quiz.category,
        reward: Number(body.reward ?? quiz.reward),
        timeLimit: Number(body.timeLimit ?? quiz.timeLimit),
        attemptsPerDay: Number(body.attemptsPerDay ?? quiz.attemptsPerDay),
        onlinePlayers: Number(body.onlinePlayers ?? quiz.onlinePlayers),
        isActive:
          typeof body.isActive === 'boolean' ? body.isActive : quiz.isActive,
      },
      include: {
        questions: true,
      },
    });
  }

  async remove(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    await this.prisma.quiz.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Quiz deleted successfully',
    };
  }
}
