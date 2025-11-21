import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllErrorsExceptionsFilter } from './common/exceptions/all-error-exceptions';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));
  app.enableCors({ origin: '*' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true 
    }),
  );
  app.useGlobalFilters(new AllErrorsExceptionsFilter());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('PokéDex API')
    .setVersion('1.0')
    .setDescription(
        'APIs for PokéDex APP (SavannahTech)',
      )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);



  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
