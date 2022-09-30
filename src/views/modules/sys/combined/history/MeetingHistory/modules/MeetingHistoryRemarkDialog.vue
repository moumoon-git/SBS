<template>
  <sv-dialog
    ref="dialog"
    title="修改备注"
    @cancel="cancel"
    @modal="cancel"
    @confirm="confirm"
  >
    <div :class="$style.container">
      <label>备注：</label>
      <sv-textarea
        v-model="remark"
        :rows="5"
        placeholder="请输入备注"
      />
    </div>
  </sv-dialog>
</template>

<script>
export default {
  name: 'MeetingHistoryRemarkDialog',
  data() {
    return {
      resolve: null,
      reject: null,
      remark: '',
    };
  },
  methods: {
    /**
     * 打开弹窗
     * @param {String} initValue 初始值
     */
    open(initValue) {
      this.remark = initValue || '';
      this.$refs.dialog.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    /**
     * 取消
     */
    cancel() {
      this.$refs.dialog.visible = false;
      this.reject();
    },
    /**
     * 确认
     */
    confirm() {
      if (!this.remark) {
        this.$message.error('请输入备注');
        return;
      }
      this.$refs.dialog.visible = false;
      this.resolve(this.remark);
    },
  },
};
</script>

<style lang="scss" module>
.container {
  display: flex;
  width: 400px;
  padding: 10px 20px;
  & > label {
    display: block;
    width: 50px;
    flex-shrink: 0;
    margin-top: 5px;
  }
}
</style>
