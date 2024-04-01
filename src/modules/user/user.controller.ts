import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseFilters,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { TypeormFilter } from '../../filters/typeorm.filter';
import { wrapperResponse } from '../../utils';

@Controller('user')
@UseFilters(new HttpExceptionFilter())
@UseFilters(new TypeormFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/info')
  getUserInfo(@Req() request) {
    // console.log('request: ', request.user); // request.user 就是登录的用户信息
    return wrapperResponse(
      this.userService.findByUsername(request.user.username),
      '获取用户信息成功',
    );
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return wrapperResponse(
      this.userService.create(createUserDto),
      '新增用户成功',
    );
  }

  @Get()
  findAll() {
    return wrapperResponse(this.userService.findAll(), '获取用户列表成功');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return wrapperResponse(this.userService.findOne(+id), '获取用户详情成功');
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return wrapperResponse(
      this.userService.update(id, updateUserDto),
      '更新用户成功',
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return wrapperResponse(this.userService.remove(+id), '删除用户成功');
  }
}
