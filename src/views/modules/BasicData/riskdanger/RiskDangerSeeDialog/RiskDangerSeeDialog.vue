<template>
  <sv-dialog
    ref="dialog"
    title="查看烟感设备详情"
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
            <div class="basic-information__left__item__label">烟感名称</div>
            <div class="basic-information__left__item__content">
              {{ formData.smokeSensingName ? formData.smokeSensingName : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">编号</div>
            <div class="basic-information__left__item__content">
              {{ formData.number ? formData.number : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">状态</div>
            <div class="basic-information__left__item__content">
              {{ formData.status ? formData.status : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">地址</div>
            <div class="basic-information__left__item__content">
              {{ formData.address ? formData.address : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">备注</div>
            <div class="basic-information__left__item__content">
              {{
                formData.remark
                  ? formData.remark
                  : ''
              }}
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
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location.vue';

export default {
  name: 'RiskDangerSeeDialog',
  components: {
    Location,
  },
  props: {},
  data() {
    return {
      loading: false,
      formData: {
        id: 0,
        smokeSensingName: '',
        number: '',
        status: '',
        address: '',
        remark: '',
      },
    };
  },
  methods: {
    /**
     * @description 数据初始化
     */
    initData() {
      this.formData = {
        id: 0,
        smokeSensingName: '',
        status: '',
        number: '',
        address: '',
        remark: '',
      };
    },
    init(id) {
      // 显示弹窗
      this.initData();
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
      this.$http({
        url: this.$http.adornUrl(`/hk/device/detail/${id}`),
        method: 'get',
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        this.loading = false;
        if (data && data.code === 0) {
          this.formData.smokeSensingName = data.riskDanger.source;
          this.formData.number = townList.length > 0 ? townList[0].townName : '';
          this.formData.status = data.riskDanger.rectificationTime?"正常":"异常";
          this.formData.address = data.riskDanger.address;
          this.formData.remark =
            data.riskDanger.deadlineForRectification;
        } else {
          console.log(
            '获取id =',
            id,
            '的详情失败！错误信息：【\n',
            data,
            '\n】',
          );
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.basic-information {
  width: 500px;
  &__left {
    * {
      line-height: 1.5;
    }
    width: 500px;
    padding: 10px 0;
    &__item {
      margin: 15px 0;
      display: flex;
      align-items: flex-start;
      &__label {
        flex-shrink: 0;
        width: 130px;
        margin-right: 20px;
        color: #999999;
        text-align: right;
      }
      &__content {
        flex-grow: 1;
        color: #333333;
      }
    }
  }
}
</style>