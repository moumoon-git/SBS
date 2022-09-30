<template>
  <div class="monitor-dialog">
    <sv-dialog
      ref="dialog"
      title="查看监控"
      @cancel="$refs.dialog.visible = false"
      @modal="$refs.dialog.visible = false"
    >
      <div class="monitor-dialog__container">
        <iframe
          frameborder="0"
          height="100%"
          width="100%"
          :src="`/static/HG/index.html?user=${monitorVideoConfig.user}&key=${monitorVideoConfig.key}&ip=${monitorVideoConfig.ip}&guid=${monitorVideoConfig.guid}&host=${$window.SITE_CONFIG.baseUrl}`"
          style="
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
          "
        />
      </div>
      <!-- 隐藏页脚 -->
      <template #footer><span /></template>
    </sv-dialog>
  </div>
</template>

<script>
export default {
  name: 'MonitorDialog',
  data() {
    return {
      monitorVideoConfig: {
        user: '',
        key: '',
        ip: '',
        guid: '',
      },
    };
  },
  mounted() {
    this.getMonitorVideoConfig();
  },
  methods: {
    init(indexCode) {
      this.monitorVideoConfig.guid = indexCode;
      this.$refs.dialog.visible = true;
    },
    getMonitorVideoConfig() {
      // 获取账号
      this.$http
        .get(
          `${window.SITE_CONFIG.baseUrl}/sys/config/infoByKey?key=HG_SP_DATA`,
        )
        .then((response) => {
          if (response.data.code === 0) {
            const loginConfig = JSON.parse(response.data.config.paramValue);
            console.log('giao', loginConfig);
            this.monitorVideoConfig.user = loginConfig.user;
            this.monitorVideoConfig.key = loginConfig.password;
            this.monitorVideoConfig.ip = loginConfig.IP;
          } else {
            console.log(
              '获取监控视频登录用户账号失败！错误信息：【\n',
              response,
              '\n】',
            );
          }
        })
        .catch((error) => {
          console.log('获取监控视频数据失败！错误信息：【\n', error, '\n】');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.monitor-dialog {
  &__container {
    width: 700px;
    height: 600px;
    overflow: hidden;
  }
}
</style>
