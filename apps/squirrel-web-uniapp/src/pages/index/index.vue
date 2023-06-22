<template>
  <tui-toast ref="refToast"></tui-toast>
  <tui-loading v-if="systemStore.sysIsNetworkLoading"></tui-loading>

  <view class="x-session-container">
    <tui-button type="primary" size="large" @click="handleAsyncOperation('file:upload')">测试文件上传</tui-button>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { onShow, onHide, onError, onLoad, onTabItemTap } from '@dcloudio/uni-app';
import { useSystemStore } from '@/stores/system';
import { useProfileStore } from '@/stores/profile';

import { CommonConfiguration } from '@/config/common.config';
import { APIConfiguration } from '@/config/api.config';
import { RequestUtils } from '@/utils/request';

import tuiBadge from '@/components/thorui/tui-badge/tui-badge.vue';
import tuiListView from '@/components/thorui/tui-list-view/tui-list-view.vue';
import tuiListCell from '@/components/thorui/tui-list-cell/tui-list-cell.vue';
import tuiSearchbar from '@/components/thorui/tui-searchbar/tui-searchbar.vue';
import tuiToast from '@/components/thorui/tui-toast/tui-toast.vue';
import tuiButton from '@/components/thorui/tui-button/tui-button.vue';
import tuiLoading from '@/components/thorui/tui-loading/tui-loading.vue';

// 业务Hooks
const systemStore = useSystemStore();
const profileStore = useProfileStore();

const refToast = ref();

onLoad(async () => {});
onTabItemTap(async () => {});
onShow(() => {});
onHide(() => {});
onError(() => {});

// 异步处理汇总
// file:upload -> 测试文件上传
const handleAsyncOperation = async (type: string, args?: any) => {
  switch (type) {
    case 'file:upload': {
      console.log('测试文件上传');
      uni.chooseImage({
        success: chooseImageRes => {
          const tempFilePath = chooseImageRes.tempFilePaths[0];
          uni.uploadFile({
            url: 'https://cos.ap-shanghai.myqcloud.com/7072-prod-4g3qwhltc0f94f6c-1318691297/image/test.jpg',
            filePath: tempFilePath,
            name: 'file',
            formData: {
              key: 'image/test.jpg',
              Signature:
                'q-sign-algorithm=sha1&q-ak=AKIDpCdw1PlvqMyy69oC2Oo2eAuQo9XrsGwPuB2IroUeW9pewZ3_xu0PnzyAwuYy9-Tg&q-sign-time=1687424254;1687425154&q-key-time=1687424254;1687425154&q-header-list=&q-url-param-list=&q-signature=1ec0872dd42dae32c6c89986cc04e2dfd3a59a9d',
              'x-cos-security-token':
                'piwR7qtosdyK3YO0xXvikawIVSCNtCwa0de013a8b9e0eae433492df935f9dcc0DQb5BJ9jb6NL8rWcYNutgySOmvMuCciyICVPeiUywatXRyebRjtig80Ws93WBABQKG0whBNQvX26Lk01P8yR0J6HQ3gqmDrGPhv4QIFUq54F5dbyoaINowtOCsI37Q4sF49lXJz9CRFhEgWVjaPRYKAZ0KmefxTU5sXqercAE8knk1Bzo9BJKKhKKwjkcTBz7OBtvkxjlfUka0VfM-GA0SPy8OanwRjfs11nVquWLaSrSyA3jFeHkteAJgoDDRBbFMoCVdNZ_AI-Zx_tXWC9IaI3QMnOb2197LeHEIif6CqLwoj5PgRzR9DEaG8YVWwdP8OdQHaT0HgCFzLSmrKy64hyoW5hOj9O6K5TMsQUGHCWGGRb5OCWGfW1EVl6Ff2D',
              'x-cos-meta-fileid':
                'HAakAfB4w52kqHdOzieHk6uXqtoSKGnxDWiLhcuML13N5bzR1ShaY0vyJeV2WJ3ilUcX5siBMRgNaSFKndVTOCi4vHHcxNN5nShBwfi7sRW5RDcJ7dkiASrjz/KjxuCW3+D37FBQ2DWTT3b3HPOMjvfd3pTz7CO7C3i6OKtQ5VdrGJVr+/E='
            },
            success: uploadFileRes => {
              console.log(uploadFileRes.data);
            },
            fail: uploadFileErr => {
              console.log(uploadFileErr);
            }
          });
        }
      });
    }
    default:
      break;
  }
};

// 同步处理汇总
const handleSyncOperation = (type: string, args?: any) => {
  switch (type) {
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
.x-session-container {
  background-color: #fff;
  height: 100%;
  color: #333;
}
</style>
