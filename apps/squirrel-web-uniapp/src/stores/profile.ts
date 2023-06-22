import { defineStore } from 'pinia';
import { CommonConfiguration } from '@/config/common.config';

export const useProfileStore = defineStore('profile', {
  state: () => {
    return {
      userMobile: uni.getStorageSync('profile::chat_user_mobile') || null, // 用户登录手机号
      userIsLogin: uni.getStorageSync('profile::chat_user_is_login') ? true : false, // 是否登录
      userToken: uni.getStorageSync('profile::chat_user_token') || null, // 用户登录token
      userOpenID: uni.getStorageSync('profile::chat_user_openid') || null, // 用户openid
      userSessionKey: uni.getStorageSync('profile::chat_user_session_key') || null, // 用户SessionKey
      userAvatar: uni.getStorageSync('profile::chat_user_avatar') || CommonConfiguration.defaultUserAvatar // 用户头像
    };
  },
  actions: {
    setUserMobile(mobile: string) {
      this.userMobile = mobile;
      uni.setStorageSync('profile::chat_user_mobile', mobile);
    },
    setUserIsLogin(isLogin: boolean) {
      this.userIsLogin = isLogin;
      uni.setStorageSync('profile::chat_user_is_login', isLogin);
    },
    setUserToken(token: string) {
      this.userToken = token;
      uni.setStorageSync('profile::chat_user_token', token);
    },
    setUserOpenID(openid: string, sessionKey: string) {
      this.userOpenID = openid;
      this.userSessionKey = sessionKey;
      uni.setStorageSync('profile::chat_user_openid', openid);
      uni.setStorageSync('profile::chat_user_session_key', sessionKey);
    },
    setUserAvatar(avatar: string) {
      this.userAvatar = avatar;
      uni.setStorageSync('profile::chat_user_avatar', avatar);
    },
    clearUserLoginStatus() {
      this.userToken = null;
      this.userIsLogin = false;
      uni.removeStorageSync('profile::chat_user_token');
      uni.removeStorageSync('profile::chat_user_is_login');
    }
  }
});
