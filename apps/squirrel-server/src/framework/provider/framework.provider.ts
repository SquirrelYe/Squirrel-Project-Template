import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

import { AuthorizationGuard } from '@/framework/guard/authorization.guard';
import { RequestInterceptor } from '@/framework/interceptor/request.interceptor';
import { HttpExceptionFilter } from '@/framework/filter/exception.filter';

/**
 * @description 框架提供者
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.15 16:50:34
 */
export const frameworkProviders = [
  { provide: APP_GUARD, useClass: AuthorizationGuard },
  { provide: APP_INTERCEPTOR, useClass: RequestInterceptor },
  { provide: APP_FILTER, useClass: HttpExceptionFilter }
];
