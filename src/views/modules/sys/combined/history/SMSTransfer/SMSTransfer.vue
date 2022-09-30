<!-- 短信转接 -->
<template>
  <div :class="$style['sms-transfer-container']">
    <el-button
      type="text"
      :icon="isSetTransfer ? $style['transfer-icon-active'] : $style['transfer-icon']"
      :class="$style['transfer-button']"
      @click="showSmsTransfer"
    >
      短信转接
    </el-button>
    <SMSTransferDialog
      ref="SMSTransferDialog"
      @update="updateTransfer"
    />
  </div>
</template>
<script>
import SMSTransferDialog from '@/views/modules/sys/combined/history/SMSTransfer/SMSTransferDialog/SMSTransferDialog.vue';

export default {
  name: 'SMSTransfer',
  components: {
    SMSTransferDialog,
  },
  data() {
    return {
      // 是否已设置短信转接
      isSetTransfer: false,
    };
  },
  methods: {
    updateTransfer(res) {
      this.isSetTransfer = !!res.length > 0;
    },
    showSmsTransfer() {
      this.$refs.SMSTransferDialog.onShow();
    },
  },
};
</script>

<style lang="scss" module>
.sms-transfer-container {
  margin: 0 20px;

  .transfer-button {
    display: flex;
    align-items: center;
    color: #969799;
    font-size: 16px;
  }

  // 图标-默认样式
  .transfer-icon {
    width: 18px;
    height: 16px;
    background: url('@/assets/img/transfer/sms_grey.svg');
    background-size: 18px 16px;
    background-repeat: no-repeat;
    margin-right: 6px;
    display: inline-block;
  }

  // 图标-激活样式
  .transfer-icon-active {
    width: 18px;
    height: 16px;
    background: url('@/assets/img/transfer/sms_blue.svg');
    background-size: 18px 16px;
    background-repeat: no-repeat;
    margin-right: 6px;
    display: inline-block;
  }
}

</style>
