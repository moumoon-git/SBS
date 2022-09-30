<template>
  <div class="big-wrap">
    <!--      切换按钮-->
    <div class="BtnHistory">
      <template
        v-if="isAuth('duanxin:mokuai') && isAuth('phone:phoneinfo:list')"
      >
        <button
          :class="viewIdx == 1 ? 'active' : ''"
          class="telRecording"
          style="border-radius:5px 0 0 5px;"
          @click="viewIdx = 1"
        >
          电话记录
        </button>
        <button
          :class="viewIdx == 2 ? 'active' : ''"
          class="SMSRecording"
          style="border-radius:0 5px 5px 0;"
          @click="viewIdx = 2"
        >
          短信记录
        </button>
        <button
          :class="viewIdx == 3 ? 'active' : ''"
          class="faxRecording"
          style="border-radius:0 5px 5px 0;"
          @click="viewIdx = 3"
        >
          传真记录
        </button>
        <button
          :class="viewIdx == 4 ? 'active' : ''"
          class="meetingRecording"
          style="border-radius:0 5px 5px 0;"
          @click="viewIdx = 4"
        >
          会议记录
        </button>
      </template>
      <template v-else-if="isAuth('duanxin:mokuai')">
        <button
          class="SMSRecording active"
          style="border-radius:5px;"
          @click="viewFlag = false"
        >
          短信记录
        </button>
      </template>
      <template v-else-if="isAuth('phone:phoneinfo:list')">
        <button
          class="telRecording active"
          style="border-radius:5px;"
          @click="viewFlag = true"
        >
          电话记录
        </button>
      </template>
    </div>

    <div class="viewWrap">
      <template
        v-if="isAuth('duanxin:mokuai') && isAuth('phone:phoneinfo:list')"
      >
        <div v-if="viewIdx == 1">
          <phoneHistory ref="phoneHistory" />
        </div>
        <div v-else-if="viewIdx == 2">
          <sms-record></sms-record>
        </div>
        <!-- 传真记录 -->
        <FaxHistory v-else-if="viewIdx === 3" />
        <!-- 会议记录 -->
        <MeetingHistory v-else-if="viewIdx === 4" />
      </template>
      <template v-else-if="isAuth('duanxin:mokuai')">
        <sms-record />
      </template>
      <template v-else-if="isAuth('phone:phoneinfo:list')">
        <phoneHistory ref="phoneHistory" />
      </template>
    </div>
  </div>
</template>

<script>
import phoneHistory from "./phoneHistory";
import SMSRecord from "./SMSRecord/SMSRecord";
import FaxHistory from './FaxHistory/FaxHistory.vue';
import MeetingHistory from './MeetingHistory/MeetingHistory.vue';

export default {
  name: "allHistory",
  components: {
    phoneHistory,
    "sms-record": SMSRecord,
    FaxHistory,
    MeetingHistory,
  },
  data() {
    return {
      viewFlag: true,
      viewIdx: 1,
    };
  },
};
</script>

<style scoped lang="scss">
@mixin button {
  border: none;
  outline: none;
  height: 38px;
  width: 80px;
  background: #fff;
  font-size: 14px;
  border-top: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
  cursor: pointer;
}
.big-wrap {
  background-color: white;
  border-radius: 3px;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  .BtnHistory {
    z-index: 9;
    display: flex;
    align-items: center;
    height: 38px;
    position: absolute;
    left: 30px;
    top: 8px;
    border: 1px solid #e4e4e4;
    border-radius: 5px;
    .telRecording,
    .SMSRecording {
      @include button;
      border-right: 1px solid #e4e4e4;
    }
    .faxRecording {
      @include button;
      border-right: 1px solid #e4e4e4;
    }
    .meetingRecording {
       @include button;
    }
    .active {
      background: #00a9f2;
      color: #fff;
    }
  }
  .viewWrap {
    height: calc(100vh - 165px);
  }
}
</style>
