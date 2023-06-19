import { defineStore } from 'pinia';
import { CommonConfiguration } from '@/config/common.config';

export const useProfileStore = defineStore('profile', {
  state: () => {
    return {
      userMobile: uni.getStorageSync('chat_user_mobile') || null, // 用户登录手机号
      userToken: uni.getStorageSync('chat_user_token') || null, // 用户登录token
      userIsLogin: uni.getStorageSync('chat_user_is_login') ? true : false, // 是否登录
      userOpenID: uni.getStorageSync('chat_user_openid') || null, // 用户openid
      userAvatar: uni.getStorageSync('chat_user_avatar') || CommonConfiguration.defaultUserAvatar // 用户openid
    };
  },
  actions: {
    setUserMobile(mobile: string) {
      this.userMobile = mobile;
      uni.setStorageSync('chat_user_mobile', mobile);
    },
    setUserToken(token: string) {
      this.userToken = token;
      uni.setStorageSync('chat_user_token', token);
    },
    setUserIsLogin(isLogin: boolean) {
      this.userIsLogin = isLogin;
      if (isLogin) {
        uni.setStorageSync('chat_user_is_login', 'True');
      } else {
        uni.removeStorageSync('chat_user_is_login');
      }
    },
    setUserOpenID(openid: string) {
      this.userOpenID = openid;
      uni.setStorageSync('chat_user_openid', openid);
    },
    setUserAvatar(avatar: string) {
      this.userAvatar = avatar;
      uni.setStorageSync('chat_user_avatar', avatar);
    },
    clearUser() {
      this.userMobile = null;
      this.userToken = null;
      this.userIsLogin = false;
      this.userOpenID = null;
      this.userAvatar = CommonConfiguration.defaultUserAvatar;
      uni.removeStorageSync('chat_user_mobile');
      uni.removeStorageSync('chat_user_token');
      uni.removeStorageSync('chat_user_is_login');
      uni.removeStorageSync('chat_user_openid');
      uni.removeStorageSync('chat_user_avatar');
    }
  }
});
