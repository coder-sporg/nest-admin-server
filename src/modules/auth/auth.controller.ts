import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { wrapperResponse } from '../../utils';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @UseFilters(new HttpExceptionFilter())
  signIn(@Body() dto: Record<string, any>) {
    return wrapperResponse(
      this.authService.signIn(dto.username, dto.password),
      '登录成功',
    );
  }
}
