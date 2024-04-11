import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { QueryBookDto } from './types';
import {
  conditionSqlUtils,
  // conditionUtils
} from '../../utils/db_helper';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  getBookList(params: QueryBookDto) {
    let { page = 1, pageSize = 20 } = params;
    const { title = '', author = '' } = params;

    // 数据边界
    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 20;

    // return this.bookRepository.find({
    //   // AND 条件
    //   where: {
    //     // title,
    //     author,
    //   },
    //   take: pageSize, // limit
    //   skip: pageSize * (page - 1), // offset
    // });

    // 使用 queryBuilder 来查询
    // const queryBuilder = this.bookRepository.createQueryBuilder('book');

    // 有值才进行模糊查询
    // if (title) {
    //   queryBuilder.andWhere('book.title like :title', { title: `%${title}%` });
    // } else {
    //   queryBuilder.where('book.title is not null');
    //   // queryBuilder.andWhere('1 = 1');
    // }

    // 等价于 上面的代码 where 1=1
    // queryBuilder.andWhere(title ? 'book.title like :title' : '1=1', {
    //   title: `%${title}%`,
    // });

    // if (author) {
    //   queryBuilder.andWhere('book.author like :author', {
    //     author: `%${author}%`,
    //   });
    // }

    const obj = {
      'book.title': title,
      'book.author': author,
    };
    // const newQueryBuilder = conditionUtils(queryBuilder, obj);

    // return newQueryBuilder
    //   .take(pageSize)
    //   .skip(pageSize * (page - 1))
    //   .getMany();

    // 原生 sql 查询
    // let where = 'where 1=1';
    // if (title) {
    //   where += ` and book.title like '%${title}%'`;
    // }
    // if (author) {
    //   where += ` and book.author like '%${author}%'`;
    // }

    const where = conditionSqlUtils(obj);
    const sql = `select * from book ${where} limit ${pageSize} offset ${(page - 1) * pageSize}`;
    return this.bookRepository.query(sql);
  }
}
