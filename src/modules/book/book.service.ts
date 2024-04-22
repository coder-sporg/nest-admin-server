import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { QueryBookDto } from './types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { conditionSqlUtils, conditionUtils } from '../../utils/db_helper';
import EpubBook from './epub-book';
import { NGINX_PATH } from '../../utils/const';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  getBook(id: number) {
    return this.bookRepository.findOne({
      where: {
        id,
      },
    });
  }

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

  getBookCount(params: QueryBookDto) {
    const { title = '', author = '' } = params;
    const obj = {
      'book.title': title,
      'book.author': author,
    };
    // const newQueryBuilder = conditionUtils(
    //   this.bookRepository.createQueryBuilder('book'),
    //   obj,
    // );
    // return newQueryBuilder.getCount(); // result => 1

    const sql = `select count(*) as count from book ${conditionSqlUtils(obj)}`;
    return this.bookRepository.query(sql); // result => [{count: '1'}]
  }

  uploadBook(file: Express.Multer.File) {
    const destDir = NGINX_PATH;
    const destPath = path.resolve(destDir, file.originalname); // 存到了 NGINX 的 uploads 文件夹中
    fs.writeFileSync(destPath, file.buffer);
    return this.parseBook(destPath, file).then((data) => ({
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: destPath,
      dir: destDir,
      data,
    }));
  }

  parseBook(bookPath: string, file: Express.Multer.File) {
    const epubBook = new EpubBook(bookPath, file); // 建模 👍
    return epubBook.parse();
  }

  addBook(book: Book) {
    // return this.bookRepository.save(book);
    const {
      title,
      author,
      fileName,
      category,
      categoryText,
      cover,
      language,
      publisher,
      rootFile,
    } = book;
    // 原生 sql 插入, 添加 '' 防止出现 MySQL 关键字
    const insertSql = `INSERT INTO book(
      fileName,
      cover,
      title,
      author,
      publisher,
      bookId,
      category,
      categoryText,
      language,
      rootFile
    ) VALUES (
      '${fileName}',
      '${cover}',
      '${title}',
      '${author}',
      '${publisher}',
      '${fileName}',
      ${category},
      '${categoryText}',
      '${language}',
      '${rootFile}'
    )`;
    return this.bookRepository.query(insertSql);
  }

  updateBook(book: Book) {
    return this.bookRepository.save(book);
  }

  deleteBook(id: number) {
    console.log('id: ', id);
    // return this.bookRepository.delete(id);
    const deleteSql = `DELETE FROM book WHERE id = ${id}`;
    return this.bookRepository.query(deleteSql);
  }
}
