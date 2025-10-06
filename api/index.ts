import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const expressApp = express();
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const { AppModule } = await import('../src/app.module');
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

export default async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};
