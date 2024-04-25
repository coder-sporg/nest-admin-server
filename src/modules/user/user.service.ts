import { Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as md5 from 'md5';
import { QueryUserDto } from './types';
import { conditionEqualUtils } from 'src/utils/db_helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    user.password = md5(user.password).toUpperCase();
    // 用户状态 1 正常 0 禁用
    if (!user.active) {
      user.active = 1;
    }

    return this.userRepository.save(user);
  }

  findAll(params: QueryUserDto): Promise<User[]> {
    let { page = 1, pageSize = 10 } = params;
    const { id, username, active } = params;

    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 10;

    // 使用queryBuilder
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    // 条件查询字段
    const obj = {
      'user.id': id,
      'user.username': username,
      'user.active': active,
    };

    const newQueryBuilder = conditionEqualUtils(queryBuilder, obj);
    return newQueryBuilder
      .take(pageSize)
      .skip((page - 1) * pageSize)
      .getMany();

    // return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);

    // username 唯一 可以不传id 通过 username 查询
    // const { username, nickname, active, role } = updateUserDto;
    // const setSql = [];
    // if (nickname) {
    //   setSql.push(`nickname="${nickname}"`);
    // }
    // if (active) {
    //   setSql.push(`active="${active}"`);
    // }
    // if (role) {
    //   setSql.push(`role=${JSON.stringify(role)}`);
    // }
    // const updateSql = `UPDATE admin_user SET ${setSql.join(',')} WHERE username="${username}"`;
    // return this.userRepository.query(updateSql);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }
}
