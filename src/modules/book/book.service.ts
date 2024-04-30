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
import { UserService } from '../user/user.service';
import { Auth } from '../role/auth.entity';

const AUTH_LIST = ['BusinessandManagement'];

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    private readonly userService: UserService,
  ) {}

  getBook(id: number) {
    return this.bookRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getBookList(params: QueryBookDto, userId: number) {
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

    let where = conditionSqlUtils(obj);

    // 查询是否需要精确到某一个分类
    const categoryList = await this.getBookCategory(userId);
    const categoryTexts = categoryList.map((item) => `'${item}'`).join(',');
    if (categoryList && categoryList.length > 0) {
      where += ` and book.categoryText in (${categoryTexts})`;
    }
    // select * from book where 1=1 and book.categoryText in ('BusinessandManagement') limit 20 offset 0
    const sql = `select * from book ${where} limit ${pageSize} offset ${(page - 1) * pageSize}`;
    return this.bookRepository.query(sql);
  }

  async getBookCount(params: QueryBookDto, userId: number) {
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

    let where = conditionSqlUtils(obj);

    // 查询 是否需要对 分类做限制
    const categoryList = await this.getBookCategory(userId);
    const categoryTexts = categoryList.map((item) => `'${item}'`).join(',');
    if (categoryList && categoryList.length > 0) {
      where += ` and book.categoryText in (${categoryTexts})`;
    }

    const sql = `select count(*) as count from book ${where}`;
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

  updateBook(id: number, book: Book) {
    // return this.bookRepository.update(id, book);
    const sql = [];

    // 拼接 sql 语句
    Object.keys(book).forEach((key) => {
      if (book[key]) {
        sql.push(`${key}='${book[key]}'`);
      }
    });
    const updateSql = `UPDATE book SET ${sql.join(',')} WHERE id = ${id}`;
    return this.bookRepository.query(updateSql);
  }

  deleteBook(id: number) {
    // return this.bookRepository.delete(id);
    const deleteSql = `DELETE FROM book WHERE id = ${id}`;
    return this.bookRepository.query(deleteSql);
  }

  // 查询当前用户可以查询电子书籍的分类 去重
  async getBookCategory(userId: number) {
    const user = await this.userService.findOne(userId);
    const roleStr = user.role ?? '[]';
    let roles = JSON.parse(roleStr);
    roles = roles.map((item) => `'${item}'`); // 转换成字符

    // // 根据角色查角色列表
    // const roleList = await this.bookRepository.query(
    //   `SELECT id FROM role WHERE name IN (${roles.join(',')})`,
    // );
    // const roleIds = roleList.map((item) => item.id);

    // // 根据角色查询权限
    // const roleAuthList = await this.bookRepository.query(
    //   `SELECT DISTINCT authId FROM role_auth WHERE roleId IN (${roleIds.join(',')})`,
    // );
    // const authIds = roleAuthList.map((item) => item.authId);

    // // 根据权限查询分类
    // const authList = await this.bookRepository.query(
    //   `SELECT * FROM auth WHERE id IN (${authIds.join(',')})`,
    // );

    // 使用子查询
    const authList = await this.bookRepository.query(
      `SELECT * FROM auth WHERE id IN (
        SELECT DISTINCT authId FROM role_auth WHERE roleId IN (
          SELECT id FROM role WHERE name IN (${roles.join(',')})
        )
      )`,
    );

    // 使用 queryBuilder 进行子查询
    // https://typeorm.bootcss.com/select-query-builder#%E4%BD%BF%E7%94%A8%E5%AD%90%E6%9F%A5%E8%AF%A2

    const categoryAuth = authList.filter((item: Auth) =>
      AUTH_LIST.includes(item.key),
    );

    const categoryList = categoryAuth.map((item: Auth) => item.key); // [ 'BusinessandManagement' ]
    return categoryList;
  }
}
