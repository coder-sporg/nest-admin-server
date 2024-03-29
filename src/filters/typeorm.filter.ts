import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // 响应 请求对象
    const response = ctx.getResponse();

    let code = 500;
    if (exception instanceof QueryFailedError) {
      code = exception.driverError.errno;
    }

    response.status(500).json({
      code: -1,
      // 服务器定义的错误，与上面的 http 的 500 可以不一致
      statusCode: code,
      // timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
