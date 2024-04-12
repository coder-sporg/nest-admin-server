export function success(data: any, msg: string) {
  return {
    code: 0,
    result: data,
    message: msg,
  };
}

export function error(msg: string) {
  return {
    code: -1,
    message: msg,
  };
}

export function wrapperResponse(p: Promise<any>, msg: string) {
  return p
    .then((data) => success(data, msg))
    .catch((err) => error(err.message));
}

/**
 * 包裹查询列表和数量接口的结果
 * @param dataPromise 查询列表数据的 接口
 * @param countPromise 查询数量的 接口
 * @param msg 消息
 * @returns
 */
export function wrapperCountResponse(
  dataPromise: Promise<any>,
  countPromise: Promise<any>,
  msg: string,
) {
  return Promise.all([dataPromise, countPromise])
    .then((res) => {
      const [data, countArr] = res;
      const [count] = countArr;
      const result = {
        data,
        total: +count.count, // 转换为 number 类型
      };
      return success(result, msg);
    })
    .catch((err) => error(err.message));
}
