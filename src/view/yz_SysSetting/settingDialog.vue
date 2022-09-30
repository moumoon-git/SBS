<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :modal="false"
    width="1000px"
    top="30px"
    class="settings-dialog"
  >
    <EventConfiguration />
  </el-dialog>
</template>

<script>
import EventConfiguration from '@/view/yz_SysSetting/EventConfiguration.vue';

export default {
  name: 'SettingDialog',
  components: {
    // 事件配置
    EventConfiguration,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: '事件配置',
    };
  },
  methods: {
    handleClose() {
      this.$emit('handleClose');
    },
  },
};
</script>

<style scoped>
.settings-dialog {
  color: rgb(101, 101, 101);
  line-height: 0;
  /* 层级要比左边侧边栏高，不然页面缩小时会被挡住 */
  /* z-index: 9999999 !important; */
}
.settings-dialog >>> .el-dialog__body {
  height: 800px;
}
</style>
