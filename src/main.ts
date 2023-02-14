import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  let config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API PRASYDE')
    .setDescription('The Prasyde API description')
    .setVersion('1.0.1')
    .addTag('Attendance')
    .addTag('Users')
    .addTag('Auth')
    .addTag('Chapters')
    .addTag('Comments')
    .addTag('Interviews')
    .addTag('Menu')
    .addTag('Roles')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
 
  await app.listen(3000);
}
bootstrap();
