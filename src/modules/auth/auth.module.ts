import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JWT_SECRET_KEY } from './auth.jwt.secrect';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true, // 将 JwtModule 注册为全局
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: '7d' }, // 过期时间 Eg: 60, "2 days", "10h", "7d"
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // 将 AuthGuard 注册为全局守卫 会绑定到所有接口上
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
