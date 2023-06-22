import { Injectable, Inject } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

import { HandleException } from '@/framework/decorator/public.decorator';
import { UserRepository, User } from '@/repository/user.repository';
import { CommonConfiguration } from '@/configuration/common.configuration';
import { Role } from '@/framework/decorator/public.decorator';

@Injectable()
export class AuthService {
  @Inject() private readonly userRepository: UserRepository;

  // 校验用户是否存在
  @HandleException()
  async checkUser(user: User) {
    const [usererr, userres] = await this.userRepository.findOne<User>({ where: { OpenID: user.OpenID } });
    return [usererr, userres];
  }

  // 生成JWT Token
  @HandleException()
  async generateToken(openid: string, roles: Role[] = [Role.User]) {
    const payload = { openid: openid, roles, time: new Date().toISOString() };
    const token = sign(payload, CommonConfiguration.AuthenticationJwtSecret, { expiresIn: CommonConfiguration.AuthenticationJwtExpiresIn });
    return [null, token];
  }

  // 校验JWT Token，Token 格式举例：Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
  @HandleException()
  async verifyToken(token: string): Promise<[Error, any]> {
    const tokenArr = (token || '').split(' ');
    if (tokenArr.length !== 2) return [new Error('Token 格式错误'), null];

    const tokenType = tokenArr[0];
    const tokenStr = tokenArr[1];
    if (tokenType !== 'Bearer') return [new Error('Token 格式错误'), null];

    const res = verify(tokenStr, CommonConfiguration.AuthenticationJwtSecret);
    return [null, res];
  }
}
