import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async findByQuiz(quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return this.prisma.question.findMany({
      where: { quizId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(body: any) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: body.quizId },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return this.prisma.question.create({
      data: {
        quizId: body.quizId,
        question: body.question,
        optionA: body.optionA,
        optionB: body.optionB,
        optionC: body.optionC,
        optionD: body.optionD,
        correctOptionId: body.correctOptionId,
      },
    });
  }

  async bulkCreate(body: any) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: body.quizId },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const questions = body.questions || [];

    if (!Array.isArray(questions) || questions.length === 0) {
      return {
        success: false,
        message: 'No questions provided',
        count: 0,
      };
    }

    const validQuestions = questions.filter((item: any) => {
      return (
        item.question &&
        item.optionA &&
        item.optionB &&
        item.optionC &&
        item.optionD &&
        ['a', 'b', 'c', 'd'].includes(item.correctOptionId)
      );
    });

    if (validQuestions.length === 0) {
      return {
        success: false,
        message: 'No valid questions found',
        count: 0,
      };
    }

    await this.prisma.question.createMany({
      data: validQuestions.map((item: any) => ({
        quizId: body.quizId,
        question: item.question,
        optionA: item.optionA,
        optionB: item.optionB,
        optionC: item.optionC,
        optionD: item.optionD,
        correctOptionId: item.correctOptionId,
      })),
    });

    return {
      success: true,
      message: 'Questions added successfully',
      count: validQuestions.length,
    };
  }

  async update(id: string, body: any) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return this.prisma.question.update({
      where: { id },
      data: {
        question: body.question,
        optionA: body.optionA,
        optionB: body.optionB,
        optionC: body.optionC,
        optionD: body.optionD,
        correctOptionId: body.correctOptionId,
      },
    });
  }

  async remove(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    await this.prisma.question.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Question deleted successfully',
    };
  }

  async checkAndUpdateAttempt(
    quizId: string,
    quizSlug: string,
    deviceId: string,
  ) {
    const today = new Date().toISOString().split('T')[0];

    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const attempt = await this.prisma.quizAttempt.findUnique({
      where: {
        quizSlug_deviceId_playDate: {
          quizSlug,
          deviceId,
          playDate: today,
        },
      },
    });

    if (!attempt) {
      await this.prisma.quizAttempt.create({
        data: {
          quizId,
          quizSlug,
          deviceId,
          playDate: today,
          attempts: 1,
        },
      });

      return {
        allowed: true,
        attemptsUsed: 1,
        attemptsPerDay: quiz.attemptsPerDay,
        remaining: Math.max(quiz.attemptsPerDay - 1, 0),
      };
    }

    if (attempt.attempts >= quiz.attemptsPerDay) {
      return {
        allowed: false,
        attemptsUsed: attempt.attempts,
        attemptsPerDay: quiz.attemptsPerDay,
        remaining: 0,
      };
    }

    const updated = await this.prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        attempts: attempt.attempts + 1,
      },
    });

    return {
      allowed: true,
      attemptsUsed: updated.attempts,
      attemptsPerDay: quiz.attemptsPerDay,
      remaining: Math.max(quiz.attemptsPerDay - updated.attempts, 0),
    };
  }

  async getAttemptStatus(quizSlug: string, deviceId: string) {
    const today = new Date().toISOString().split('T')[0];

    const quiz = await this.prisma.quiz.findUnique({
      where: { slug: quizSlug },
    });

    if (!quiz) {
      return {
        attemptsUsed: 0,
        attemptsPerDay: 2,
        remaining: 0,
        locked: true,
      };
    }

    const attempt = await this.prisma.quizAttempt.findUnique({
      where: {
        quizSlug_deviceId_playDate: {
          quizSlug,
          deviceId,
          playDate: today,
        },
      },
    });

    const attemptsUsed = attempt?.attempts || 0;
    const remaining = Math.max(quiz.attemptsPerDay - attemptsUsed, 0);

    return {
      attemptsUsed,
      attemptsPerDay: quiz.attemptsPerDay,
      remaining,
      locked: attemptsUsed >= quiz.attemptsPerDay,
    };
  }
}
