import { proxy, proxyMap, proxySet, subscribe, snapshot, useSnapshot } from '@umijs/max';

// 1、定义数据
export const state = proxy({
  userInfo: {} || JSON.parse(localStorage.getItem('userProfile::userInfo') || '{}'),
  userToken: '' || localStorage.getItem('userProfile::userToken'),
  userName: '' || localStorage.getItem('userProfile::userName'),
  userOpenId: '' || localStorage.getItem('userProfile::userOpenId')
});

// 2、定义操作
export const actions = {
  setUserInfo(userInfo: any) {
    state.userInfo = userInfo;
    localStorage.setItem('userProfile::userInfo', JSON.stringify(userInfo));
  },
  setUserToken(userToken: string) {
    state.userToken = userToken;
    localStorage.setItem('userProfile::userToken', userToken);
  },
  setUserName(userName: string) {
    state.userName = userName;
    state.userOpenId = userName;
    localStorage.setItem('userProfile::userName', userName);
    localStorage.setItem('userProfile::userOpenId', userName);
  },
  setUserLogout() {
    state.userInfo = {};
    state.userToken = '';
    state.userName = '';
    state.userOpenId = '';
    localStorage.removeItem('userProfile::userInfo');
    localStorage.removeItem('userProfile::userToken');
    localStorage.removeItem('userProfile::userName');
    localStorage.removeItem('userProfile::userOpenId');
  }
};

/**
 * @description 用户信息 Store
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.18 16:17:40
 */
export function useUserProfileStore() {
  const userProfile = useSnapshot(state);

  return {
    ...userProfile,
    ...actions
  };
}
