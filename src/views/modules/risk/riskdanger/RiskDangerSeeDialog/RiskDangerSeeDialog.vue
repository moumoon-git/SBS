<template>
  <sv-dialog
    ref="dialog"
    title="查看风险隐患详情"
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
            <div class="basic-information__left__item__label">隐患源</div>
            <div class="basic-information__left__item__content">
              {{ formData.source ? formData.source : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">辖区范围</div>
            <div class="basic-information__left__item__content">
              {{ formData.jurisdiction ? formData.jurisdiction : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">隐患地址</div>
            <div class="basic-information__left__item__content">
              {{ formData.address ? formData.address : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">整改时间</div>
            <div class="basic-information__left__item__content">
              {{ formData.rectificationTime ? formData.rectificationTime : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">整改期限</div>
            <div class="basic-information__left__item__content">
              {{
                formData.deadlineForRectification
                  ? formData.deadlineForRectification
                  : ''
              }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">可控程度</div>
            <div class="basic-information__left__item__content">
              {{ formData.controllability ? formData.controllability : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">隐患类型</div>
            <div class="basic-information__left__item__content">
              {{ formData.typeName ? formData.typeName : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">隐患等级</div>
            <div class="basic-information__left__item__content">
              {{ formData.level ? formData.level : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">联系人</div>
            <div class="basic-information__left__item__content">
              {{
                formData.notificationObjectName
                  ? formData.notificationObjectName
                  : ''
              }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">
              联系人手机号码
            </div>
            <div class="basic-information__left__item__content">
              {{ formData.contactTelephone ? formData.contactTelephone : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">负责人</div>
            <div class="basic-information__left__item__content">
              {{
                formData.principalName
                  ? formData.principalName
                  : ''
              }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">
              负责人手机号码
            </div>
            <div class="basic-information__left__item__content">
              {{ formData.principalMobile ? formData.principalMobile : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">
              可能造成的影响
            </div>
            <div class="basic-information__left__item__content">
              {{ formData.possibleImpact ? formData.possibleImpact : '' }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">
              处置能力和资源储备
            </div>
            <div class="basic-information__left__item__content">
              {{
                formData.disposingCapacityOrResourceReserve
                  ? formData.disposingCapacityOrResourceReserve
                  : ''
              }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">整改措施</div>
            <div class="basic-information__left__item__content">
              {{
                formData.rectificationMeasuresSituation
                  ? formData.rectificationMeasuresSituation
                  : ''
              }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">
              未完成整改原因
            </div>
            <div class="basic-information__left__item__content">
              {{
                formData.reasonsForNotCompleted
                  ? formData.reasonsForNotCompleted
                  : ''
              }}
            </div>
          </div>
          <div class="basic-information__left__item">
            <div class="basic-information__left__item__label">关联设备</div>
            <div class="basic-information__left__item__content">
              <div :class="$style.backDiv">
                <div
                  v-for="(item, idx) in deviceTextArr"
                  :key="idx"
                  :class="$style.outDiv"
                >
                  <div
                    v-for="(item1, idx1) in showDeviceData[item]"
                    :key="idx1"
                    :class="$style.showDevice"
                  >
                    <div :class="$style.type">
                      {{ deviceObj[item1.type] }}
                    </div>
                    <div :class="$style.deviceName">
                      <span :title="item1.name">{{ item1.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- B. 右边栏 -->
        <div class="basic-information__right">
          <Location
            :address="formData.address"
            :lng-lat="[formData.longitude, formData.latitude]"
            :display-only="true"
          />
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
      // 可控程度:可控、基本可控、较难控制、基本失控
      controllabilityData: [
        { value: 1, label: '可控' },
        { value: 2, label: '基本可控' },
        { value: 3, label: '较难控制' },
        { value: 4, label: '基本失控' },
      ],
      //  隐患等级: 一般、较大、重大、特别重大
      levelData: [
        { value: 1, label: '一般' },
        { value: 2, label: '较大' },
        { value: 3, label: '重大' },
        { value: 4, label: '特别重大' },
      ],
      // 辖区范围
      jurisdictionData: [],
      deviceObj: {
        0: '监控视频',
        1: '会场终端',
        2: '集群终端',
        // 3: 'WeComm',
        4: 'APP终端',
      },
      deviceTypeObj: {
        0: 'monitor',
        1: 'room',
        2: 'colony',
        // 3: 'wecomm',
        4: 'app',
      },
      deviceTextArr: [
        'monitor',
        'room',
        'colony',
        // 'wecomm',
        'app',
      ],
      showDeviceData: {
        monitor: [],
        room: [],
        colony: [],
        // wecomm: [],
        app: [],
      },
      formData: {
        id: 0,
        source: '',
        deadlineForRectification: '',
        rectificationTime: '',
        controllability: '',
        type: '',
        level: 1,
        contacts: '',
        contactTelephone: '',
        principalMobile: '',
        possibleImpact: '',
        disposingCapacityOrResourceReserve: '',
        rectificationMeasuresSituation: '',
        reasonsForNotCompleted: '',
        notificationObjectId: '',
        notificationObjectName: '',
        principalName: '',
        notificationContent: '',
        longitude: '',
        latitude: '',
        address: '',
        notificationMethod: '',
        jurisdiction: '',
      },
    };
  },
  methods: {
    /**
     * @description 数据初始化
     */
    initData() {
      this.showDeviceData = {
        monitor: [],
        room: [],
        colony: [],
        // wecomm: [],
        app: [],
      };
      this.formData = {
        id: 0,
        source: '',
        deadlineForRectification: '',
        rectificationTime: '',
        controllability: '',
        type: '',
        level: 1,
        contacts: '',
        contactTelephone: '',
        principalMobile: '',
        possibleImpact: '',
        disposingCapacityOrResourceReserve: '',
        rectificationMeasuresSituation: '',
        reasonsForNotCompleted: '',
        notificationObjectId: '',
        notificationObjectName: '',
        principalName: '',
        notificationContent: '',
        longitude: '',
        latitude: '',
        address: '',
        notificationMethod: '',
        jurisdiction: '',
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
        url: this.$http.adornUrl(`/risk/riskdanger/info/${id}`),
        method: 'get',
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        this.loading = false;
        if (data && data.code === 0) {
          this.formData.source = data.riskDanger.source;
          this.formData.address = data.riskDanger.address;
          this.formData.deadlineForRectification =
            data.riskDanger.deadlineForRectification;
          this.formData.rectificationTime = data.riskDanger.rectificationTime;
          this.formData.controllability = data.riskDanger.controllability
            ? this.controllabilityData.filter(
              (el) => el.value === data.riskDanger.controllability,
            )[0].label
            : '';
          this.formData.typeName = data.riskDanger.typeName;
          this.formData.level = data.riskDanger.level
            ? this.levelData.filter(
              (el) => el.value === data.riskDanger.level,
            )[0].label
            : '';
          this.formData.contacts = data.riskDanger.contacts;
          this.formData.contactTelephone = data.riskDanger.contactTelephone;
          this.formData.principalMobile = data.riskDanger.principalMobile;
          this.formData.possibleImpact = data.riskDanger.possibleImpact;
          this.formData.disposingCapacityOrResourceReserve =
            data.riskDanger.disposingCapacityOrResourceReserve;
          this.formData.rectificationMeasuresSituation =
            data.riskDanger.rectificationMeasuresSituation;
          this.formData.reasonsForNotCompleted =
            data.riskDanger.reasonsForNotCompleted;
          this.formData.notificationObjectId =
            data.riskDanger.notificationObjectId;
          this.formData.notificationContent =
            data.riskDanger.notificationContent;
          this.formData.longitude = data.riskDanger.longitude;
          this.formData.latitude = data.riskDanger.latitude;
          this.formData.notificationObjectName = data.riskDanger.contacts;
          this.formData.principalName = data.riskDanger.principalName;
          this.formData.notificationMethod = data.riskDanger.notificationMethod;
          this.formData.townId = data.riskDanger.townId;
          const townList = this.jurisdictionData.filter(
            (el) => el.id === data.riskDanger.townId,
          );
          this.formData.jurisdiction =
            townList.length > 0 ? townList[0].townName : '';
          data.resources.forEach((item) => {
            const typeChange = parseInt(item.type, 10) - 9;
            const arrType = this.deviceTypeObj[typeChange];
            item.data.forEach((item1) => {
              const o = {};
              o.id = item1.entity.id;
              o.name = item1.entity.name;
              o.type = typeChange;
              this.showDeviceData[arrType].push(o);
            });
          });
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
  width: 900px;
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
        width: 130px;
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

<style lang="scss" module>
.backDiv {
  background: #f2f2f2;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #d5d5d5;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}
.outDiv {
  margin-top: -2px;
  .showDevice {
    display: flex;
    align-items: center;
    height: 30px;
    line-height: 30px;
    margin: 5px;
    .type {
      width: 25%;
      text-align: center;
      border: 1px dashed #0091ff;
      padding: 0px 5px;
    }
    .deviceName {
      width: 75%;
      padding-left: 10px;
      color: #0091ff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
