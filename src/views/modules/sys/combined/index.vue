<template>
  <div :class="$style.container">
    <el-tabs
      v-model="activeName"
      class="sbs-tabs"
    >
      <el-tab-pane
        v-if="isAuth('phone:phoneinfo:list')"
        label="电话调度"
        :name="
          isAuth('phone:phoneinfo:list') && isAuth('duanxin:mokuai')
            ? 'first'
            : ''
        "
      >
        <phone />
      </el-tab-pane>
      <el-tab-pane
        v-if="isAuth('duanxin:mokuai')"
        label="短信调度"
        :name="
          isAuth('duanxin:mokuai') && !isAuth('phone:phoneinfo:list')
            ? 'first'
            : 'second'
        "
      >
        <!-- <note /> -->
        <SMSDispatch />
      </el-tab-pane>
      <el-tab-pane
        v-if="isAuth('chuanzhen:xianshi')"
        label="传真调度"
        :name="
          isAuth('chuanzhen:xianshi') &&
            !isAuth('duanxin:mokuai') &&
            !isAuth('phone:phoneinfo:list')
            ? 'first'
            : isAuth('duanxin:mokuai') && isAuth('phone:phoneinfo:list')
              ? 'fourth'
              : 'second'
        "
      >
        <fax
          @switch-to-fax-record="handleSwitchToFaxRecord"
        />
      </el-tab-pane>
      <el-tab-pane
        label="会议调度"
        name="fifth"
      >
        <MeetingDispatch />
      </el-tab-pane>
      <el-tab-pane
        label="通讯历史"
        name="third"
      >
        <allHistory
          ref="allHistoryRef"
        />
      </el-tab-pane>
    </el-tabs>
    <div :class="$style['transfer-buttons']">
      <SMSTransfer />
      <!-- <PhoneTransfer /> -->
    </div>
  </div>
</template>

<script>
import bus from '@/views/common/js/eventBus';
import { createClient } from '@/assets/js/uds/useUDS.js';
import allHistory from './history/allHistory';
import phone from './phone/phone';
import fax from './fax/fax';
// 短信调度
import SMSDispatch from './SMSDispatch/SMSDispatch.vue';
// 会议调度
import MeetingDispatch from './MeetingDispatch/MeetingDispatch.vue';
import SMSTransfer from '@/views/modules/sys/combined/history/SMSTransfer/SMSTransfer.vue';
import PhoneTransfer from '@/views/modules/sys/combined/history/PhoneTransfer/PhoneTransfer.vue';

export default {
  name: 'Index',
  components: {
    allHistory,
    phone,
    fax,
    SMSDispatch,
    MeetingDispatch,
    SMSTransfer,
    PhoneTransfer,
  },
  provide() {
    return {
      combined: this,
    };
  },
  data() {
    return {
      activeName: 'first',
      uds: null,
    };
  },
  created() {
    this.uds = createClient();
  },
  beforeDestroy() {
    this.uds.disconnect();
  },
  mounted() {
    // 通讯调度>通讯历史>短信记录>发送记录 列表转发跳转监听
    // 事件接报>每日一报>发送传真 跳转到传真调度
    bus.$on('tabChange', (val) => {
      this.activeName = val;
    });
  },
  methods: {
    /**
     * 切换到通讯历史-传真记录
     */
    handleSwitchToFaxRecord() {
      // 1. 切换到通讯历史
      this.activeName = 'third';
      // 2. 切换到传真记录
      this.$nextTick(() => {
        this.$refs.allHistoryRef.viewIdx = 3;
      });
    },
  },
};
</script>

<style lang="scss" module>
.container {
  width: 100%;
  height: 100%;
  position: relative;

  :global(.el-tabs__header) {
    background: #FFF;
  }
}

.transfer-buttons {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
