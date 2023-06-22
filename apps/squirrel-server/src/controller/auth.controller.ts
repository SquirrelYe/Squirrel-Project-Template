import { Inject } from '@nestjs/common';
import { Controller, Post, Headers, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { User, UserRepository } from '@/repository/user.repository';
import { Admin, AdminRepository } from '@/repository/admin.repository';
import { AuthService } from '@/service/auth.service';
import { UserService } from '@/service/user.service';

import { R } from '@/util/R';
import { Logger } from '@/util/logger';
import { Public, Role } from '@/framework/decorator/public.decorator';

const logger = new Logger('AuthController');

@Controller('/api/v1/auth')
export class AuthController {
  @Inject() private readonly authService: AuthService;
  @Inject() private readonly userService: UserService;
  @Inject() private readonly userRepository: UserRepository;
  @Inject() private readonly adminRepository: AdminRepository;

  @Post('/Register')
  @Public()
  @HttpCode(HttpStatus.OK)
  async register(@Headers() headers: any, @Body() body: any) {
    const openID = headers['__openid__'];
    const userName = body.UserName;

    const userObj = new User();
    userObj.UserName = userName;
    userObj.Introduction = '';
    userObj.Gender = '';
    userObj.Province = '';
    userObj.City = '';
    userObj.Avatar = '';
    userObj.OpenID = openID;
    userObj.UserID = '';

    const [err, res] = await this.userService.createUser(userObj);
    if (err) return R.error(-1, err.message);

    return R.ok(res);
  }

  @Post('/Login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Headers() headers: any) {
    const openID = headers['__openid__'];
    const userObj = new User();
    userObj.OpenID = openID;

    // 校验用户是否存在
    const [usererr, userres] = await this.userService.getUserByOpenID(userObj.OpenID);
    if (usererr) return R.error(-1, usererr.message);

    // 生成 Token
    const [err, res] = await this.authService.generateToken(openID);
    if (err) return R.error(-1, err);

    return R.ok({ Token: res, User: userres });
  }

  @Post('/AdminLogin')
  @Public()
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Headers() headers: any, @Body() body: any) {
    const userName = body.UserName;
    const password = body.Password;

    const [err, res] = await this.adminRepository.findOne<Admin>({ where: { UserName: userName }, raw: true });
    if (err) return R.error(-1, err.message);
    if (!res) return R.error(-1, '用户不存在');
    if (res.Password !== password) return R.error(-1, '密码错误');

    // 生成 Token
    const [tokenerr, tokenres] = await this.authService.generateToken(res.UserName, [Role.Admin]);
    if (tokenerr) return R.error(-1, tokenerr);

    return R.ok({ Token: tokenres, User: res });
  }

  @Post('/Logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  async logout() {
    console.log('logout');
  }

  @Post('/AdminLogout')
  @Public()
  @HttpCode(HttpStatus.OK)
  async adminLogout() {
    console.log('adminLogout');
    return R.ok();
  }

  // 校验用户是否存在
  @Post('/Verify')
  @Public()
  @HttpCode(HttpStatus.OK)
  async verify(@Headers() headers: any) {
    const openID = headers['__openid__'];
    const [err, res] = await this.userService.getUserByOpenID(openID);
    if (err) return R.error(-1, err.message);
    return R.ok(res);
  }

  // 校验Token是否有效
  @Post('/Validate')
  @Public()
  @HttpCode(HttpStatus.OK)
  async validate(@Headers() headers: any) {
    const token = headers['authorization'];

    // 校验Token
    const [err, res] = await this.authService.verifyToken(token);
    if (err) return R.error(-1, err.message);

    // 校验用户是否存在
    const [usererr, userres] = await this.userService.getUserByOpenID(res.openid);
    if (usererr || !userres) return R.error(-1, '用户不存在');

    return R.ok(userres);
  }
}
