<template>
  <div class="SpeechText_wrap">
    <div class="SpeechText_content">
      <header class="SpeechText_header">
        <span>语音转文字</span>
        <img
          @click="close"
          src="../../../../../../static/img/Communihistory/close.png"
          alt=""
        />
      </header>
      <aside class="SpeechText_contents">
        <el-input
          ref="copyEle"
          v-model="textarea"
          v-loading="loading"
          :readonly="true"
          :rows="14"
          type="textarea"
          placeholder=""
        />
      </aside>

      <footer class="SpeechText_footer">
        <el-button type="primary" @click="copyContent">复制全文</el-button>
        <el-button type="primary" @click="cellRemark">存为电话备注</el-button>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SpeechText',
  data() {
    return {
      textarea: '',
      loading: true, // 加载中
    };
  },
  computed: {
    ...mapGetters({
      getTurnToTextLoading: 'getTurnToTextLoading',
    }),
  },
  watch: {
    /**
     * @author hexinting
     * @date 2020-10-14
     * @description 监听语音转文字过程
     */
    getTurnToTextLoading: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.loading = newVal || false;
      },
    },
  },
  methods: {
    copyContent() {
      let ele = this.$refs.copyEle;
      ele.select(); // 选择对象
      document.execCommand('Copy'); // 执行浏览器复制命令
      this.$message({
        message: '已复制到剪切板',
        type: 'success',
      });
    },
    //存为电话备注
    cellRemark() {
      this.$emit('cellRemark', { remark: this.textarea });
      this.$emit('closeSpeechTextEle', { remark: this.textarea });
      this.$message({
        message: '已存为电话备注',
        type: 'success',
      });
    },
    close() {
      this.$emit('closeSpeechTextEle', { remark: this.textarea });
    },
  },
};
</script>

<style scoped>
.SpeechText_wrap {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.SpeechText_content {
  width: 759px;
  height: 655px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 3px rgba(0, 0, 0, 0.27);
  border-radius: 7px;
  display: flex;
  flex-direction: column;
}
.SpeechText_header {
  width: 759px;
  height: 56px;
  background: rgba(241, 244, 246, 1);
  border-radius: 7px 7px 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 28px;
  box-sizing: border-box;
}
.SpeechText_header > span {
  font-size: 18px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.SpeechText_header > img {
  cursor: pointer;
}
.SpeechText_contents {
  height: 510px;
  padding: 28px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(221, 222, 225, 1);
}
.SpeechText_contents /deep/ .el-textarea__inner {
  height: 456px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(221, 222, 225, 1);
  font-size: 17px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  padding: 11px 20px;
  overflow-y: scroll;
  box-sizing: border-box;
  text-align: left;
  resize: none;
}
.SpeechText_footer {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 21px;
  box-sizing: border-box;
}
</style>
