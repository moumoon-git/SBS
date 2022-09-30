<template>
  <sv-dialog
    ref="dialog"
    title="修改会议名称"
    @cancel="cancel"
    @modal="cancel"
    @confirm="confirm"
  >
    <div :class="$style.container">
      <label>名称：</label>
      <sv-input-search
        v-model="name"
        :suffix="false"
        width="100%"
        placeholder="请输入会议名称"
      />
    </div>
  </sv-dialog>
</template>

<script>
export default {
  name: 'MeetingHistoryRenameDialog',
  data() {
    return {
      resolve: null,
      reject: null,
      name: '',
    };
  },
  methods: {
    /**
     * 打开弹窗
     * @param {String} initValue 初始值
     */
    open(initValue) {
      this.name = initValue || '';
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
      if (!this.name) {
        this.$message.error('请输入会议名称');
        return;
      }
      this.$refs.dialog.visible = false;
      this.resolve(this.name);
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
