import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('seed')
  seed() {
    return this.quizService.createSampleQuiz();
  }

  @Post()
  create(@Body() body: any) {
    return this.quizService.create(body);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.quizService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.quizService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(id);
  }
}
