import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

const expressApp = express();
let cachedApp;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    app.enableCors();
    app.setGlobalPrefix('api');

    await app.init();
    cachedApp = app;
  }
  return expressApp;
}

export default async (req, res) => {
  const app = await bootstrap();
  app(req, res);
};
