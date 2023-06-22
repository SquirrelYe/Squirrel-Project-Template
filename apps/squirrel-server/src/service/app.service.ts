import { Injectable, Inject } from '@nestjs/common';

import { HandleException } from '@/framework/decorator/public.decorator';
import { UserRepository, User } from '@/repository/user.repository';
import { Logger } from '@/util/logger';

const logger = new Logger('AppService');

@Injectable()
export class AppService {
  @Inject() private readonly userRepository: UserRepository;

  // 获取全部用户信息
  @HandleException()
  async listUser() {
    const [userserr, usersres] = await this.userRepository.findMany<User>({ raw: true });
    logger.log('userList --->', userserr, usersres);
    return [userserr, usersres];
  }
}
