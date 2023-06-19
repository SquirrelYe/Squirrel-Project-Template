import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { R } from '@/util/R';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // 将默认的POST请求返回状态码201改为200
    // 未知原因，此拦截器未生效，任然需要在controller中手动设置状态码 @HttpCode(HttpStatus.OK)
    if (request.method === 'POST') {
      if (response.status === 201) context.switchToHttp().getResponse().status(HttpStatus.OK);
    }

    return next.handle().pipe(
      map(data => {
        if (data instanceof R) return data.transformHttpReturnResult();
        return R.ok(data).transformHttpReturnResult();
      })
    );
  }
}
