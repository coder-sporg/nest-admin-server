import { SelectQueryBuilder } from 'typeorm';

/**
 * 拼接 WHERE 条件，有值才拼接
 * @param queryBuilder 查询构造器
 * @param obj 表字段的映射
 */
export const conditionUtils = <T>(
  queryBuilder: SelectQueryBuilder<T>,
  obj: Record<string, unknown>,
) => {
  // WHERE 1=1 AND ...
  // title like :title
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      queryBuilder.andWhere(`${key} like :${key}`, { [key]: obj[key] });
    }
  });
  return queryBuilder;
};

// const obj = {
//   'book.title': title, // 值是传递的参数
//   'book.author': author,
// };

export const conditionSqlUtils = (obj: Record<string, unknown>) => {
  let where = 'where 1=1';
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      where += ` and ${key} like '%${obj[key]}%'`;
    }
  });
  return where;
};
