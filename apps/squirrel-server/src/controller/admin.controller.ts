import { Inject } from '@nestjs/common';
import { Controller, Post, Headers, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { AuthService } from '@/service/auth.service';
import { User, UserRepository } from '@/repository/user.repository';
import { Admin, AdminRepository } from '@/repository/admin.repository';

import { R } from '@/util/R';
import { Logger } from '@/util/logger';
import { Public, Role, Roles } from '@/framework/decorator/public.decorator';

const logger = new Logger('AdminController');

@Controller('/api/v1/admin')
export class AdminController {
  @Inject() private readonly authService: AuthService;
  @Inject() private readonly userRepository: UserRepository;
  @Inject() private readonly adminRepository: AdminRepository;

  @Post('/GetAdminProfile')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async getAdminProfile(@Headers() headers: any) {
    const token = headers['authorization'];

    // 校验Token
    const [err, res] = await this.authService.verifyToken(token);
    if (err) return R.error(-1, err.message);

    // {
    //   openid: 'will',
    //   roles: [ 'Admin' ],
    //   time: '2023-06-18T11:01:36.207Z',
    //   iat: 1687086096,
    //   exp: 1687172496
    // }

    // const [err, res] = await this.adminRepository.findOne<Admin>({ where: { UserName: userName }, raw: true });
    // if (err) return R.error(-1, err.message);
    // if (!res) return R.error(-1, '用户不存在');
    // return R.ok(res);

    return R.ok({
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      email: 'antdesign@alipay.com',
      signature: '海纳百川，有容乃大',
      title: '交互专家',
      group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
      tags: [{ key: '0', label: '很有想法的' }],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      access: 'admin',
      geographic: {
        province: {
          label: '浙江省',
          key: '330000'
        },
        city: {
          label: '杭州市',
          key: '330100'
        }
      },
      address: '西湖区工专路 77 号',
      phone: '0752-268888888'
    });
  }
}
