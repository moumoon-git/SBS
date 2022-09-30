<template>
  <div class="report-event-container">
    <!-- 轮播图 -->
    <div v-show="eventDealList.length > 0" class="event_list_wrap">
      <EventSwiper
        ref="eventSwiperRef"
        @item-click="handleItemClick"
      />
    </div>

    <!-- 内容部分 -->
    <div v-show="eventDealList.length > 0" class="event-deal-detail-container">
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          事件标题:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.eventTitle }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          事发时间:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.incidentTime }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          接报时间:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.reportedTime }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          事故单位:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.accidentUnit }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          所属区域:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.incidenAreaName }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          事发地点:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.incidentSite }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          落图地点:
        </div>
        <div class="event-deal-detail_right">
          <span>
            {{ activeEventDeal.fallFigureAddress }}
          </span>
          <i
            class="el-icon-location-outline icon-location"
            @click="location"
          />
          <el-button
            size="mini"
            @click="sendSite"
          >
            发送
          </el-button>
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          报告单位:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.reportingUnitName }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          事件类型:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.incidenTypeName }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          信息要素:
        </div>
        <div class="event-deal-detail_right">
          <div class="event-params">
            <div
              v-for="item in activeEventDeal.eventParams"
              :key="item.pId + item.sId"
              class="event-param"
            >
              {{ item.name + ':   ' + (item.value || '  ') + (item.unit || '') }}
            </div>
          </div>
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          事件简况:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.reportDescription }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          现场处置情况:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.disposalSituation }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          事发原因:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.matterCause }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          已造成后果:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.matterConsequence }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          事件发展趋势:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.matterTendency }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          已采取措施:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.step }}
        </div>
      </div>
      <!-- bug14193 隐藏转办人、转办时间、转办部门 -->
      <!-- <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          转办人:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.matterTrun }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          转办时间:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.matterTime }}
        </div>
      </div>
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          转办部门:
        </div>
        <div class="event-deal-detail_right">
          {{ activeEventDeal.matterBranch }}
        </div>
      </div> -->
      <div class="event-deal-detail">
        <div class="event-deal-detail_left">
          其他附件:
        </div>
        <div class="event-deal-detail_right">
          <div
            v-if="activeEventDeal.uploadFileData && activeEventDeal.uploadFileData.length > 0"
            class="file_list"
          >
            <div
              v-for="(item) in activeEventDeal.uploadFileData"
              :key="item.index"
              class="file_item"
            >
              <i class="el-icon-paperclip" />
              <span
                class="file_name"
                @click="downloadFile(item)"
              >{{
                item.fileName
              }}</span>
            </div>
          </div>
          <span v-else>暂无附件</span>
        </div>
      </div>
      <div v-if="showBottomButton" :class="$style.button">
        <el-button
          size="big"
          type="primary"
          @click="toEventRegister"
        >
          转到事件处置
        </el-button>
      </div>
    </div>

    <div
      v-show="eventDealList.length === 0"
      :class="$style['noData']"
    >
      <img :src="require('@/assets/img/noFile.png')" alt="" :class="$style['noData-img']">
      <span>暂无事件续报</span>
    </div>

    <sv-dialog
      ref="LocationDialogRef"
      title="定位"
      @modal="handleClosex"
      @cancel="handleClosex"
    >
      <div style="min-width: 600px; min-height: 400px; padding: 20px">
        <Location
          :address="activeEventDeal.fallFigureAddress"
          :lng-lat="[activeEventDeal.longitude, activeEventDeal.latitude]"
          :display-only="true"
          @confirm="handleLocationConfirm"
        />
      </div>
    </sv-dialog>

    <!--发送事发地点-->
    <multiple-contact
      v-if="hackResetMultiple"
      ref="selectDialog"
      :select-title="selectTitle"
      :select-data="selectData"
      @close="closeMultiple"
      @confirm="confirmMultiple"
      @closeDialog="closeMyDialogMultiple"
    />
  </div>
</template>

<script>
import EventSwiper from '@/view/eventManagement/informationDisposal/SystemReport/components/EventSwiper/EventSwiper.vue';
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location';
import multipleContact from '@/view/yz_eventManagement/eventReports/dialog/selectDialog';

const $downloadFile = require('@/utils/downloadFile.js').default;

export default {
  name: 'ReportEvent',
  components: {
    EventSwiper,
    Location,
    multipleContact,
  },
  data() {
    return {
      eventId: '', // 事件id
      hackResetMultiple: true, // 强制刷新
      selectData: false, // 发送事发地点是否弹窗
      selectTitle: '', // 发送事发地点弹窗标题

      eventDealList: [],
      currentIndex: 0,
      activeEventDeal: {
        eventDealId: '', // 续报id
        serialNumber: '', // 事件编号
        eventTitle: '', // 事件标题
        reportedTime: '', // 报送时间
        incidentTime: '', // 事发时间
        timeOfWrittenSubmission: '', // 书面报送时间
        incidenArea: [], // 所属区域
        incidenAreaName: '', // 所属区域
        reportingUnit: [], // 报告单位id
        reportingUnitName: '', // 报告单位名字
        incidentSite: '', // 事发地点
        submissionMethod: '', // 报送方式
        accidentSituation: '', // 事故情况
        incidenType: [], // 事件类型
        incidenTypeName: '', // 事件类型
        incidentRank: '', // 事件等级
        reportSituation: '', // 上报情况
        reportDescription: '', // 事件报文
        speakerName: '', // 报告人名字
        speakerPhone: '', // 报告人电话
        beOnDuty: '', // 值班员
        leaderOnDuty: '', // 值班领导
        leaderOnDutyIds: [],
        uploadFileData: [], // 上传文件
        accidentUnit: '', // 事故单位
        disposalSituation: '', // 处置情况
        fallFigureAddress: '', // 落图地点
        latitude: '', // 纬度
        longitude: '', // 经度
        // -- 扩展信息 start---
        matterCause: '', // 事发原因
        matterConsequence: '', // 已造成后果
        matterTendency: '', // 事件发展趋势
        step: '', // 已采取措施
        matterTrun: '', // 转办人
        matterTime: '', // 转办时间
        matterBranch: '', // 转办部门
        // --- 扩展信息 end---
        disposalName: '', // 处置姓名
        disposalUnit: '', // 处置单位
        disposalPosition: '', // 处置职务
        disposalPhone: '', // 处置电话
        eventParams: [], // 信息要素
        platformName: '', // 平台名称
      },
      showBottomButton: false, // 显示事件处置按钮
    };
  },
  watch: {
    eventDealList: {
      handler(newVal) {
        this.$nextTick(() => {
          this.$refs.eventSwiperRef.eventDealList = newVal;
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /**
     * @description 转到事件登记
     */
    toEventRegister() {
      // 在右边事件登记表单加载事件最新的事件续报
      this.$emit('to-event-register', this.eventDealList[0]);
    },
    /**
     * @description 单个点击
     */
    handleItemClick(index) {
      this.currentIndex = index;
      this.activeEventDeal = this.eventDealList[this.currentIndex].eventData;
    },
    /**
     * @description 下载附件
     */
    downloadFile(item) {
      const request = {
        method: 'get',
        url: `/eos/event/sum/downloadFile?fileName=${item.fileName}&filePath=${item.filePath}`,
        baseURL: window.SITE_CONFIG.fileupload,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.$cookie.get('token'),
        },
        responseType: 'arraybuffer',
      };
      $downloadFile(request);
    },
    /*
     * @descripttion: 地点定位
     */
    location() {
      this.$refs.LocationDialogRef.visible = true;
    },
    handleClosex() {
      this.$refs.LocationDialogRef.visible = false;
    },
    handleLocationConfirm(data) {
      this.$refs.LocationDialogRef.visible = false;
    },
    /*
     * @descripttion 发送事发地点
     */
    sendSite() {
      this.selectTitle = '选择联系人';
      this.selectData = true;
    },
    /**
     * @description 关闭事发地点的弹窗
     */
    closeMultiple() {
      // this.hackResetMultiple = false;
      // this.$nextTick(() => {
      //   // this.$nextTick执行一轮循环后刷新dom。
      //   this.hackResetMultiple = true;
      // });
      this.selectData = false;
    },

    /**
     * @descripttion 发送事发地点弹窗确认
     */
    confirmMultiple(checkedCities) {
      if (checkedCities === '' || checkedCities === []) {
        this.$message({
          message: '请先选择联系人',
          type: 'warning',
        });
        return;
      }
      // this.hackResetMultiple = false;
      // this.$nextTick(() => {
      //   // this.$nextTick执行一轮循环后刷新dom。
      //   this.hackResetMultiple = true;
      // });
      const data = {
        title: this.eventDealList[this.currentIndex].eventData.eventTitle,
        eventId: this.eventId, // 事件id
        contacter: checkedCities,
      };
      this.$api.sendLocation(data).then((res) => {
        if (res.errorcode === 0) {
          this.selectData = false;
          this.$message({
            message: '发送成功！',
            type: 'success',
          });
        }
      });
    },
    /**
     * @description 关闭选择联系人弹窗
     */
    closeMyDialogMultiple() {
      // this.hackResetMultiple = false;
      // this.$nextTick(() => {
      //   // this.$nextTick执行一轮循环后刷新dom。
      //   this.hackResetMultiple = true;
      // });
      this.selectData = false;
    },
  },
};
</script>
<style lang="scss">
.report-event-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .event_list_wrap {
    width: 100%;
    height: auto;
    padding: 0 6px;
    box-sizing: border-box;
  }

  // 事件
  .event-deal-detail-container {
    width: 100%;
    height: calc(100% - 70px);
    overflow-y: scroll;

    .event-deal-detail {
      width: 100%;
      height: auto;
      padding: 10px;
      display: flex;
      align-items: baseline;
      justify-content: flex-start;
      box-sizing: border-box;

      &_left {
        margin-right: 20px;
        width: 88px;
        text-align: right;
      }

      &_right {
        flex: 1;

        .event-params {
          display: flex;
          align-items: baseline;
          justify-content: flex-start;
          flex-wrap: wrap;

          .event-param {
            margin: 0 20px 10px 0;

          }
        }

        .file_list {

          .file_item {
            margin-bottom: 10px;
          }

          .file_name {
            cursor: pointer;
          }

        }
      }
    }
  }
}
</style>
<style lang="scss" module>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}
.noData {
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #999999;
}
.noData-img {
  margin-bottom: 10px;
}
</style>
