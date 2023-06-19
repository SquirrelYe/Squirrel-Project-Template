import { flushSync } from 'react-dom';
import { useModel, history } from '@umijs/max';

import { useUserProfileStore } from '@/stores/user.store';
import { getAdminProfile } from '@/services/auth.service';
import { CommonConstant } from '@/constants/common.constant';

// 拉取用户信息
export const fetchAdminProfileInfo = async () => {
  try {
    const msg = await getAdminProfile({ skipErrorHandler: true });
    return msg.Data;
  } catch (error) {
    history.push(CommonConstant.RouterPathLogin);
  }
  return undefined;
};

// 拉取用户信息
export const useFetchAdminProfileInfo = () => {
  const { setInitialState } = useModel('@@initialState');
  const userProfileStore = useUserProfileStore();

  const doFetchAdminProfileInfo = async () => {
    const userInfo: any = await fetchAdminProfileInfo();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s: any) => ({ ...s, currentAdminProfile: userInfo }));
        userProfileStore.setUserInfo(userInfo);
      });
    }
  };

  return {
    doFetchAdminProfileInfo
  };
};
