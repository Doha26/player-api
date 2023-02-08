import { APIGatewayProxyHandler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let cachedServer: Server;

// Setup Swagger for API Documentation
const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Player API')
    .setDescription('The Player API description')
    .setVersion('1.0')
    .addTag('player')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};

// Bootstrap the API Server
const bootstrapServer = async (): Promise<Server> => {
  if (!cachedServer) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create(AppModule, adapter);
    app.enableCors();
    setupSwagger(app);
    await app.init();
    cachedServer = awsServerlessExpress.createServer(expressApp);
    try {
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return cachedServer;
};

// Create the lambda function
export const handler: APIGatewayProxyHandler = async (event: any, context) => {
  if (event.path === '/api') {
    event.path = '/api/';
  }
  event.path = event?.path?.includes('swagger-ui')
    ? `/api${event.path}`
    : event.path;

  cachedServer = await bootstrapServer();
  return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE')
    .promise;
};
