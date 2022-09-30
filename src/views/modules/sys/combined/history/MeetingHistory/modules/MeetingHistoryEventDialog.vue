<template>
  <sv-dialog
    ref="dialog"
    title="关联事件"
    @cancel="cancel"
    @modal="cancel"
    @confirm="confirm"
  >
    <div :class="$style.container">
      <label>事件：</label>
      <sv-select
        v-model="eventId"
        :clearable="true"
        :options="eventList.map((val) => ({ label: val.title, value: val.id }))"
        placeholder="请选择事件"
        width="100%"
        align="left"
      />
    </div>
  </sv-dialog>
</template>

<script>
export default {
  name: 'MeetingHistoryEventDialog',
  props: {
    eventList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      resolve: null,
      reject: null,
      eventId: '',
    };
  },
  methods: {
    /**
     * 打开弹窗
     * @param {String} initValue 初始值
     */
    open(initValue) {
      this.eventId = initValue || '';
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
      this.$refs.dialog.visible = false;
      this.resolve(this.eventId);
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
