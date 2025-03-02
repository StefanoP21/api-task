import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { HttpExceptionFilter } from './common/helpers/error.handler';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = new ConfigService().get('PORT');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  await app.listen(port);
}
bootstrap();
