import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Contents } from './contents.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Contents)
    private contentsRepository: Repository<Contents>,
  ) {}

  findContentsByFileName(fileName: string) {
    const selectSql = `SELECT * FROM contents WHERE fileName = '${fileName}'`;
    return this.contentsRepository.query(selectSql);
  }

  // 在 MySQL 中，如果一个表的主键是由多个字段组成的复合主键，那么只有当这两个字段的组合值完全相同时，才会被视为重复主键。
  // 因此，即使 fileName 相同，只要 navId 不同，MySQL 不会报错。
  create(createContentDto) {
    const { fileName, navId, href, order, level, text, label, pid, id } =
      createContentDto;
    // order 是 MySQL 中关键字
    const insertSql = `INSERT INTO contents(
      fileName,
      navId,
      href,
      \`order\`,
      level,
      text,
      label,
      pid,
      id
    ) VALUES (
      '${fileName}',
      '${navId}',
      '${href}',
      ${order},
      ${level},
      '${text}',
      '${label}',
      '${pid}',
      '${id}'
    )`;
    return this.contentsRepository.query(insertSql);
  }

  remove(fileName: string) {
    const deleteSql = `DELETE FROM contents WHERE fileName = '${fileName}'`;
    return this.contentsRepository.query(deleteSql);
  }
}
