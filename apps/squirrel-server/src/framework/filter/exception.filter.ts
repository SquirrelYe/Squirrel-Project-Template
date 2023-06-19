import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@/util/logger';

const logger = new Logger('HttpExceptionFilter');

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception?.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message;
    const stack = exception.stack;

    logger.error(`[${request.method}] ${request.url} ${status} ${message} ${stack}`);

    response.status(status).json({
      Code: -1,
      Message: message,
      Data: null,
      Time: new Date().toISOString(),
      Path: request.url
    });
  }
}
