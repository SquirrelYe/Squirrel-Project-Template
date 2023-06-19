import { ConsoleLogger, Inject } from '@nestjs/common';
import { Controller, Post, Headers, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { User, UserRepository } from '@/repository/user.repository';
import { R } from '@/util/R';

const logger = new ConsoleLogger('UserController');

@Controller('/api/v1/user')
export class UserController {
  @Inject() private readonly userRepository: UserRepository;

  @Post('/GetUserProfile')
  @HttpCode(HttpStatus.OK)
  async GetUserProfile(@Headers() headers: any) {
    const openID = headers['x-wx-openid'];
    const [err, res] = await this.userRepository.findOne<User>({ where: { OpenID: openID }, raw: true });
    if (err) return R.error(-1, err.message);
    return R.ok(res);
  }

  @Post('/UpdateUserProfile')
  @HttpCode(HttpStatus.OK)
  async UpdateUserProfile(@Headers() headers: any, @Body() body: any) {
    const openID = headers['x-wx-openid'];
    const userObj = new User();
    userObj.ID = body.UserID;
    userObj.Avatar = body.Avatar;
    userObj.UserName = body.UserName;
    userObj.Gender = body.Gender;
    userObj.Birthday = body.Birthday;
    userObj.PhoneNum = body.PhoneNum;

    const [err, res] = await this.userRepository.update(userObj, { where: { OpenID: openID } });
    if (err) return R.error(-1, err.message);
    return R.ok(res);
  }

  @Post('/GetUserConfiguration')
  @HttpCode(HttpStatus.OK)
  async GetUserConfiguration(@Headers() headers: any) {
    const openID = headers['x-wx-openid'];
    const config = {};
    return R.ok(config);
  }

  @Post('/UpdateUserConfiguration')
  @HttpCode(HttpStatus.OK)
  async UpdateUserConfiguration(@Headers() headers: any, @Body() body: any) {
    const openID = headers['x-wx-openid'];
    const config = {};
    return R.ok(config);
  }
}
