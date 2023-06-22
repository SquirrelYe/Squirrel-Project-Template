<template>
  <!-- 数据展示区域 -->
  <view class="x-profile-setting-container">
    <tui-list-cell padding="0" :arrow="true">
      <view class="x-profile-setting-list-cell">
        <view>头像</view>
        <button class="x-profile-setting-avatar-wrapper" open-type="chooseAvatar" @chooseavatar="(e: any) => handleAsyncOperation('setting:avatar:change', e)">
          <image :src="userInfo.avatar" class="x-profile-setting-avatar"></image>
        </button>
      </view>
    </tui-list-cell>

    <tui-list-cell padding="0" :arrow="true" @click="handleSyncOperation('setting:nickname:click')">
      <view class="x-profile-setting-list-cell">
        <view>用户名</view>
        <view class="x-profile-setting-content">{{ userInfo.nickname }}</view>
      </view>
    </tui-list-cell>

    <tui-list-cell padding="0" :arrow="true">
      <view class="x-profile-setting-list-cell" @click="handleSyncOperation('setting:gender:change')">
        <view>性别</view>
        <view class="x-profile-setting-content">{{ userInfo.gender }}</view>
      </view>
    </tui-list-cell>

    <tui-list-cell padding="0" :arrow="true">
      <view class="x-profile-setting-list-cell" @click="handleSyncOperation('setting:birthday:change')">
        <view>出生日期</view>
        <view class="x-profile-setting-content">{{ userInfo.birthday }}</view>
      </view>
    </tui-list-cell>

    <tui-list-cell padding="0" :arrow="true">
      <view class="x-profile-setting-list-cell" @click="handleSyncOperation('setting:phone:change')">
        <view>手机号</view>
        <view class="x-profile-setting-content">{{ userInfo.phone }}</view>
      </view>
    </tui-list-cell>
  </view>

  <!-- 弹窗修改数据区域 -->
  <tui-dialog
    :buttons="CommonConfiguration.dialogButtonList"
    :show="isShowEditDislog"
    title="修改数据"
    class="x-profile-setting-dialog"
    @close="isShowEditDislog = !isShowEditDislog"
    @click="(e: any) => handleAsyncOperation('setting:edit:form:submit', e)"
  >
    <template #content>
      <!-- 1. 修改昵称 -->
      <view v-if="settingType === 'nickname'">
        <tui-list-cell padding="0" unlined>
          <view class="x-profile-setting-list-cell">
            <view>用户名</view>
            <input
              type="nickname"
              class="x-profile-setting-content"
              v-model="formUserNickname"
              @change="e => handleSyncOperation('setting:nickname:change', e)"
              placeholder="请输入用户名"
              :maxlength="20"
            />
          </view>
        </tui-list-cell>
      </view>

      <!-- 2. 修改手机号 -->
      <view v-if="settingType === 'phone'">
        <tui-list-cell padding="0" unlined>
          <view class="x-profile-setting-list-cell">
            <tui-button
              class="x-profile-setting-phone"
              bold
              width="500rpx"
              height="75rpx"
              size="30"
              color="#0076ff"
              open-type="getPhoneNumber"
              @getphonenumber="(e: any) => handleAsyncOperation('setting:phone:decode', e)"
            >
              点击获取手机号
            </tui-button>
          </view>
        </tui-list-cell>
      </view>
    </template>
  </tui-dialog>

  <!-- 时间日期选择 -->
  <tui-calendar ref="refCalendar" activeBgColor="#0076ff" btnBgColor="#0076ff" lunar isFixed :type="1" @change="(e: any) => handleAsyncOperation('setting:birthday:submit', e)"></tui-calendar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow, onHide, onError, onLoad } from '@dcloudio/uni-app';
import { useSystemStore } from '@/stores/system';
import { useProfileStore } from '@/stores/profile';

import { CommonConfiguration } from '@/config/common.config';
import { APIConfiguration } from '@/config/api.config';
import { RequestUtils } from '@/utils/request';

import tuiIcon from '@/components/thorui/tui-icon/tui-icon.vue';
import tuiButton from '@/components/thorui/tui-button/tui-button.vue';
import tuiText from '@/components/thorui/tui-text/tui-text.vue';
import tuiDialog from '@/components/thorui/tui-dialog/tui-dialog.vue';
import tuiListCell from '@/components/thorui/tui-list-cell/tui-list-cell.vue';
import tuiCalendar from '@/components/thorui/tui-calendar/tui-calendar.vue';

// 业务Hooks
const systemStore = useSystemStore();
const profileStore = useProfileStore();

const refCalendar = ref<any>(null);
const isShowEditDislog = ref(false);

const userInfo = ref({
  id: null,
  avatar: CommonConfiguration.defaultUserAvatar,
  nickname: CommonConfiguration.defaultUserNickName,
  gender: CommonConfiguration.defaultUserGender,
  birthday: CommonConfiguration.defaultUserBirthday,
  phone: CommonConfiguration.defaultUserPhone
});
const userIdentity = computed(() => systemStore.sysMiniProgramConfig.UserIdentificationCodePrefix + profileStore.userOpenID);
const settingType = ref(''); // 修改数据类型
const formUserNickname = ref(''); // 修改昵称
const formUserPhone = ref(''); // 修改手机号

onLoad(() => {
  handleAsyncOperation('user:profile:load');
});
onShow(() => {});
onHide(() => {});
onError(() => {});

// 异步处理汇总
const handleAsyncOperation = async (type: string, args?: any) => {
  switch (type) {
    case 'user:profile:load': {
      const reqPath = APIConfiguration.ApiGetUserProfile;
      const reqObj = {};
      const [usererr, userres] = await new RequestUtils().request({ path: reqPath, method: 'POST', data: reqObj, header: {} });
      if (usererr) return;
      userInfo.value = {
        id: userres.Data.ID,
        avatar: userres.Data.Avatar || CommonConfiguration.defaultUserAvatar,
        nickname: userres.Data.UserName || CommonConfiguration.defaultUserNickName,
        gender: userres.Data.Gender || CommonConfiguration.defaultUserGender,
        birthday: userres.Data.Birthday || CommonConfiguration.defaultUserBirthday,
        phone: userres.Data.PhoneNum || CommonConfiguration.defaultUserPhone
      };
      break;
    }
    case 'setting:edit:submit': {
      const { id, avatar, nickname, gender, birthday, phone } = userInfo.value;
      const reqPath = APIConfiguration.ApiUpdateUserProfile;
      const reqObj = { UserID: id, Avatar: avatar, UserName: nickname, Gender: gender, Birthday: birthday, PhoneNum: phone };
      const [usererr, userres] = await new RequestUtils().request({ path: reqPath, method: 'POST', data: reqObj, header: {} });
      if (usererr) return;
      else {
        uni.showToast({ title: '修改成功', icon: 'none' });
        await handleAsyncOperation('user:profile:load');
      }
      break;
    }
    case 'setting:edit:form:submit': {
      if (settingType.value === 'nickname') {
        userInfo.value.nickname = formUserNickname.value;
        isShowEditDislog.value = false;
      } else if (settingType.value === 'phone') {
        userInfo.value.phone = formUserPhone.value;
        isShowEditDislog.value = false;
      }
      await handleAsyncOperation('setting:edit:submit');
      break;
    }
    case 'setting:birthday:submit': {
      userInfo.value.birthday = args.result;
      await handleAsyncOperation('setting:edit:submit');
      break;
    }
    case 'setting:phone:decode': {
      console.log('setting:phone:decode', args);
      const Code = args.code;
      if (!Code) {
        uni.showToast({ title: '获取手机号失败', icon: 'none' });
        return;
      }

      const reqPhonePath = APIConfiguration.ApiWeiXinGetUserPhoneNumber;
      const reqPhoneObj = { Code };
      const [phoneerr, phoneres] = await new RequestUtils().request({ path: reqPhonePath, method: 'POST', data: reqPhoneObj, header: {} });
      if (phoneerr) return;

      const PhoneNumber = phoneres.Data?.phone_info?.phoneNumber;
      if (!PhoneNumber) {
        uni.showToast({ title: '获取手机号失败', icon: 'none' });
        return;
      }

      userInfo.value.phone = PhoneNumber;
      isShowEditDislog.value = false;
      await handleAsyncOperation('setting:edit:submit');

      break;
    }
    case 'setting:avatar:change': {
      console.log('setting:avatar:change', args);
      const filePath = args.detail.avatarUrl;

      // 1. 上传文件
      const cloudPath = CommonConfiguration.WeiXinCloudBaseFileUserAvatarUploadDirectory + '/' + new Date().getTime() + '-' + filePath.split('/').pop();
      const [uploaderr, uploadres] = await new RequestUtils().uploadFile({ cloudPath: cloudPath, filePath: filePath });
      if (uploaderr) return;

      // 2. 保存数据库
      const { FilePath, FileID } = uploadres;
      userInfo.value.avatar = FileID;
      await handleAsyncOperation('setting:edit:submit');
      break;
    }
    default:
      break;
  }
};

// 同步处理汇总
const handleSyncOperation = (type: string, args?: any) => {
  switch (type) {
    case 'setting:nickname:click': {
      settingType.value = 'nickname';
      formUserNickname.value = userInfo.value.nickname;
      isShowEditDislog.value = true;
      break;
    }
    case 'setting:nickname:change': {
      formUserNickname.value = args.detail.value;
      break;
    }
    case 'setting:phone:change': {
      console.log('setting:phone:change');
      settingType.value = 'phone';
      isShowEditDislog.value = true;
      break;
    }
    case 'setting:gender:change': {
      uni.showActionSheet({
        itemList: CommonConfiguration.dialogUserGenderList,
        success: res => {
          userInfo.value.gender = CommonConfiguration.dialogUserGenderList[res.tapIndex];
          handleAsyncOperation('setting:edit:submit');
        },
        fail: err => {
          uni.showToast({ title: '取消选择', icon: 'none' });
          uni.showLoading({ title: '加载中...', mask: true });
          uni.hideLoading();
        }
      });
      break;
    }
    case 'setting:birthday:change': {
      refCalendar.value.show();
      break;
    }
    case 'setting:openid:copy': {
      uni.setClipboardData({
        data: userIdentity.value,
        success: () => {
          uni.showToast({ title: '复制用户编码成功', icon: 'none' });
        },
        fail: () => {
          uni.showToast({ title: '复制用户编码失败', icon: 'none' });
        }
      });
      break;
    }
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
.text-elipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.x-profile-setting-container {
  height: 100vh;
  width: 100vw;
  padding-bottom: env(safe-area-inset-bottom);
  margin: 20rpx 0;
  color: #333;

  .x-profile-setting-list-cell {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 60rpx 24rpx 30rpx;
    box-sizing: border-box;
    font-size: 30rpx;
  }

  .x-profile-setting-pr30 {
    padding-right: 30rpx;
  }

  .x-profile-setting-avatar-wrapper {
    display: contents;
    position: relative;
    padding: 0;
    border-radius: 50%;
  }

  .x-profile-setting-avatar {
    width: 60rpx;
    height: 60rpx;
    display: block;
  }

  .x-profile-setting-content {
    font-size: 26rpx;
    color: #666;
  }
}

.x-profile-setting-dialog {
  .x-profile-setting-list-cell {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24rpx 60rpx 24rpx 30rpx;
    box-sizing: border-box;
    font-size: 30rpx;
  }

  .x-profile-setting-content {
    font-size: 26rpx;
    color: #666;
  }
  .x-profile-setting-phone {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
