import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['randomstring'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      // Whitelist removes extra properties automatically provided
      // with the req.
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
