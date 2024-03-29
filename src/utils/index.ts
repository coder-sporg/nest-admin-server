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
