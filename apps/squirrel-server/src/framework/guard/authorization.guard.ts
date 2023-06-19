import { Injectable, Inject, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core/services';

import { Logger } from '@/util/logger';
import { AuthService } from '@/service/auth.service';
import { UserService } from '@/service/user.service';
import { PublicSymbol } from '@/framework/decorator/public.decorator';
import { Role, RoleSymbol } from '@/framework/decorator/public.decorator';

const logger = new Logger('AuthorizationGuard');

/**
 * @description JWT Token 验证守卫
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.15 15:34:50
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  @Inject() private readonly authService: AuthService;
  @Inject() private readonly userService: UserService;
  @Inject() private readonly reflector: Reflector;

  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // 获取是否是公共接口
    const isPublic = await this.validateIsPublic(context);
    if (isPublic) return true;

    // 验证Token
    const [message, payload] = await this.validateToken(context);
    if (message) throw new HttpException(message, HttpStatus.UNAUTHORIZED);

    // Payload 数据示例：
    // {
    //   openid: 'openid_xxxxx',
    //   roles: [ 'Admin', 'User', 'WeChatMiniProgram' ],
    //   time: '2023-06-16T01:41:32.203Z',
    //   iat: 1686879692,
    //   exp: 1686966092
    // }

    // 验证用户是否有权限访问该接口
    const roles = payload?.roles || [];
    const [requiredRoles, isHasRole] = await this.validateRole(context, roles);
    if (!isHasRole) throw new HttpException('当前用户没有权限访问该接口，需要权限：' + requiredRoles.join('、') + '，当前权限：' + roles.join('、'), HttpStatus.FORBIDDEN);

    // 处理Payload
    request.payload = payload;

    // 如果它返回true，请求将被处理；如果返回false，Nest 将拒绝该请求。
    return true;
  }

  // 判断接口是否是公共接口，如果是公共接口则不需要验证token
  private async validateIsPublic(context: ExecutionContext): Promise<boolean> {
    // context.getHandler() 获取即将调用的方法，context.getClass() 获取Controller类型
    const isPublic = !!this.reflector.getAllAndOverride<boolean>(PublicSymbol, [context.getHandler(), context.getClass()]);
    return isPublic;
  }

  // 验证用户Token是否有效
  private async validateToken(context: ExecutionContext): Promise<[string, any]> {
    const request = context.switchToHttp().getRequest();

    // 获取token
    const token = request.headers.authorization;

    // 验证token
    const [err, payload] = await this.authService.verifyToken(token);
    if (err) return ['Token验证失败', null];

    return [null, payload];
  }

  // 验证用户是否有权限访问该接口
  private async validateRole(context: ExecutionContext, roles: Role[]): Promise<[Role[], boolean]> {
    // context.getHandler() 获取即将调用的方法，context.getClass() 获取Controller类型
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(RoleSymbol, [context.getHandler(), context.getClass()]) || [];
    if (!requiredRoles.length) return [[], true];

    const isHasRole = (roles || []).some((role: Role) => requiredRoles.includes(role));
    return [requiredRoles, isHasRole];
  }
}
