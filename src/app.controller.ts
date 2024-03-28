import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from './enum/config.enum';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    console.log('config', this.configService.get(ConfigEnum.DB_PORT));
    return this.appService.getHello();
  }
}
