import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as md5 from 'md5';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new ForbiddenException('用户不存在!');
    }

    const md5Password = md5(password).toUpperCase(); // 更推荐使用 argon2 加密
    if (md5Password !== user.password) {
      throw new ForbiddenException('用户名或密码错误!');
    }

    const payload = { username: user.username, userid: user.id };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
