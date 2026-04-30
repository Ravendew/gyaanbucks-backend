import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('quiz/:quizId')
  findByQuiz(@Param('quizId') quizId: string) {
    return this.questionService.findByQuiz(quizId);
  }

  @Get('status/:quizSlug/:deviceId')
  getStatus(
    @Param('quizSlug') quizSlug: string,
    @Param('deviceId') deviceId: string,
  ) {
    return this.questionService.getAttemptStatus(quizSlug, deviceId);
  }

  @Post('attempt')
  checkAttempt(
    @Body()
    body: {
      quizId: string;
      quizSlug: string;
      deviceId: string;
    },
  ) {
    return this.questionService.checkAndUpdateAttempt(
      body.quizId,
      body.quizSlug,
      body.deviceId,
    );
  }

  @Post()
  create(@Body() body: any) {
    return this.questionService.create(body);
  }

  @Post('bulk')
  bulkCreate(@Body() body: any) {
    return this.questionService.bulkCreate(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.questionService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(id);
  }
}
