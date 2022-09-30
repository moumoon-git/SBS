<template>
  <el-dialog
    :show-close="false"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :close-on-press-escape="false"
    top="350px"
    width="400px"
  >
    <div style="width: 90%; text-align: left; margin: 0 auto; font-size: 16px">
      发现您还有未保存修改的内容，是否保存？
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="mini"
        @click="noSave"
      >
        不保存
      </el-button>
      <el-button
        size="mini"
        @click="offSave"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        size="mini"
        @click="yesSave"
      >
        保存
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'LeaveReminderDialog',
  data() {
    return {
      dialogVisible: true,
    };
  },
  methods: {
    noSave() {
      this.$emit('noSave');
    },
    offSave() {
      this.$emit('offSave');
    },
    yesSave() {
      this.$emit('yesSave');
    },
  },
};
</script>
