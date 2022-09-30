<template lang="">
  <div>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="发布通知公告"
        name="SendNotifyTab"

      >
        <send-notify-tab ref="SendNotifyTab" />
      </el-tab-pane>
      <el-tab-pane
        label="接收通知公告"
        name="receiveNotifyTab"
      >
        <receive-notify-tab ref="ReceiveNotifyTab" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SendNotifyTab from './SendNotifyTab.vue';
import ReceiveNotifyTab from './ReceiveNotifyTab.vue';

export default {
  name: 'Announcement',
  components: {
    SendNotifyTab,
    ReceiveNotifyTab,
  },
  data() {
    return {
      activeName: 'SendNotifyTab',
    };
  },
  methods: {
    handleClick() {
      if(this.activeName === 'SendNotifyTab') {
        this.$refs.SendNotifyTab.getDataList();
      }else {
        this.$refs.ReceiveNotifyTab.getTableData();
      }

    },

  },
};
</script>
<style lang="">

</style>
