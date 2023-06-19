import { Injectable, Inject } from '@nestjs/common';

import { UserRepository, User } from '@/repository/user.repository';

@Injectable()
export class UserService {
  @Inject() private readonly userRepository: UserRepository;

  // 根据 OpenID 获取用户信息
  async getUserByOpenID(openid: string): Promise<[Error, User]> {
    const [usererr, userres] = await this.userRepository.findOne<User>({ where: { OpenID: openid } });
    return [usererr, userres];
  }

  // 创建新用户
  async createUser(user: User) {
    const [usererr, userres] = await this.userRepository.create<User>(user);
    return [usererr, userres.toJSON()];
  }

  // 更新用户信息
  async updateUser(user: User, option: any) {
    const [usererr, userres] = await this.userRepository.update(user, option);
    return [usererr, userres];
  }
}
