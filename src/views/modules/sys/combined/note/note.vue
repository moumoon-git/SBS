<template>
  <div>
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="发送短信" name="first"> -->
        <sms-send></sms-send>
    <!-- </el-tab-pane>
    <el-tab-pane label="短信历史" name="second">
        <sms-history></sms-history>
    </el-tab-pane> -->
    <!-- </el-tabs> -->
  </div>
</template>

<script>
import smsSend from './sms_send/sms_send'
// import smsHistory from './sms_history/sms_history'
import Bus from '@/views/common/js/eventBus'

export default {
  name: "sms",
  components: {
      "sms-send": smsSend,
      // "sms-history": smsHistory
  },
  data() {
    return {
        activeName: 'first'
    };
  },
  mounted(){
    Bus.$on('tabForward',()=>{
      this.activeName = 'first'
    })
  },
  methods: {
    handleClick(tab, event) {
        // console.log(tab, event);
      }
  },
};
</script>

<style scoped>
</style>
