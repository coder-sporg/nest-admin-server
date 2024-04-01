import * as fs from 'fs';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { HttpExceptionFilter } from './filters/http-exception.filter';

const dir = process.cwd();

const httpsOptions = {
  key: fs.readFileSync(path.resolve(dir, './https/ssl.key')),
  pem: fs.readFileSync(path.resolve(dir, './https/ssl.pem')),
};

async function bootstrap() {
  const httpApp = await NestFactory.create(AppModule, { cors: true });
  const httpsApp = await NestFactory.create(AppModule, {
    cors: true,
    httpsOptions,
  });

  // app.setGlobalPrefix('api');
  // 全局过滤器 只能有一个
  // app.useGlobalFilters(new HttpExceptionFilter());

  await httpApp.listen(3000);
  await httpsApp.listen(4000);
}
bootstrap();
