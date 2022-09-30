<template>
  <sv-dialog
    ref="dialog"
    title="视频监控详情"
    @cancel="handleDialogClose"
    @modal="handleDialogClose"
  >
    <div class="vd">
      <div
        class="basic-information"
        v-loading="loading"
        element-loading-spinner="sv-loading"
      >
        <div class="basic-information__left">
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">监控名称</div>
            <div class="basic-information__left__item__content">
              {{ formData.name ? formData.name : "" }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">监控号码</div>
            <div class="basic-information__left__item__content">
              {{ formData.codeNum ? formData.codeNum : "" }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">所属分组</div>
            <div class="basic-information__left__item__content">
              {{ formData.groupIdName ? formData.groupIdName : "" }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 去掉底部 -->
    <template #footer><span></span></template>
  </sv-dialog>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      loading: false,
      formData: {},
    };
  },
  methods: {
    init(id) {
      // 显示弹窗
      // console.log("显示弹窗");
      this.$refs.dialog.visible = true;
      this.getData(id);
    },
    handleDialogClose() {
      this.$refs.dialog.visible = false;
    },
    /**
     * @method
     * @desc 获取基本信息页面的信息
     * @param {String} id 数据的id
     */
    getData(id) {
      this.loading = true;
      const request = {
        method: "get",
        url: `/meeting/meetingCamera/infor/${id}`,
        baseURL: window.SITE_CONFIG.baseUrl,
        params: {
          token: this.token,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code == 0) {
            Object.assign(this.formData, response.data.MeetingCamera);
          } else {
            console.log(
              "获取id =",
              id,
              "的详情失败！错误信息：【\n",
              response,
              "\n】"
            );
          }
          this.loading = false;
        })
        .catch((error) => {
          console.log(
            "获取id =",
            id,
            "的详情失败！错误信息：【\n",
            error,
            "\n】"
          );
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.basic-information {
  display: flex;
  justify-content: center;
  align-items: stretch;
  &__left {
    * {
      line-height: 1.5;
    }
    width: 500px;
    min-height: 339px;
    padding: 10px 0;
    &__item {
      margin: 15px 0;
      display: flex;
      align-items: flex-start;
      &__label {
        flex-shrink: 0;
        width: 120px;
        margin-right: 20px;
        color: #999999;
        text-align: right;
      }
      &__content {
        flex-grow: 1;
        color: #333333;
      }
      &__tag {
        border: 1px solid #e0e0e0;
        border-radius: 3px;
        padding: 0 10px;
        background: #fafafa;
        margin: 0 5px 5px 0;
        display: inline-block;
        // word-break: keep-all;
      }
      img {
        margin: 0 10px 10px 0;
        cursor: zoom-in;
      }
    }
  }
  &__right {
    flex: 1;
    padding: 20px;
  }
}
</style>