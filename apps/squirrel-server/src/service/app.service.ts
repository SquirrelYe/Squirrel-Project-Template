import { Injectable, Inject } from '@nestjs/common';

import { UserRepository, User } from '@/repository/user.repository';
import { Logger } from '@/util/logger';

const logger = new Logger('AppService');

@Injectable()
export class AppService {
  @Inject() private readonly userRepository: UserRepository;

  async listUser() {
    const [userserr, usersres] = await this.userRepository.findMany<User>({ raw: true });
    logger.log('userList --->', userserr, usersres);
    return [userserr, usersres];
  }
}
