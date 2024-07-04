import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { HonoAdapter } from './hono.adapter.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new HonoAdapter());
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
await bootstrap();

console.log('Help at http://localhost:3000/help');
