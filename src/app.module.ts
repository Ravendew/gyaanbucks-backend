import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionModule } from './question/question.module';
import { QuizModule } from './quiz/quiz.module';
import { UsersModule } from './users/users.module';
import { RedeemModule } from './redeem/redeem.module';
import { CategoryModule } from './category/category.module';
import { RedeemSettingModule } from './redeem-setting/redeem-setting.module';
import { BlogModule } from './blog/blog.module';
import { UploadModule } from './upload/upload.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';

@Module({
  imports: [
    PrismaModule,
    QuizModule,
    QuestionModule,
    UsersModule,
    RedeemModule,
    CategoryModule,
    RedeemSettingModule,
    BlogModule,
    UploadModule,
    AdminAuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
