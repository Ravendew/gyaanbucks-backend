import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://gyaanbucks-frontend.vercel.app',
      'https://gyaanbucks-admin.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  const port = process.env.PORT || 5000;

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 GyaanBucks backend running on port ${port}`);
}

bootstrap();
