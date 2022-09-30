<!-- 系统上报 createDate:20210807 需求417 -->
<template>
  <div class="system-report-container">
    <div class="system-report-container_top">
      <!-- 筛选器 -->
      <SearchCondition
        @search="searchEvent"
      />
    </div>
    <div class="system-report-container_bottom">
      <div class="system-report-container_left">
        <!-- 左边 - 上报结果-表格 -->
        <ReportResult
          ref="reportResultRef"
          @row-click="handleRowClick"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          @refresh="handleRefreshEvent"
        />
      </div>
      <div class="system-report-container_right">
        <!-- 中间 - 续报 -->
        <ReportEvent
          ref="reportEventRef"
          :event-deal-list="eventDealList"
          @to-event-register="handleToEventRegister"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SearchCondition from '@/view/eventManagement/informationDisposal/SystemReport/components/SearchCondition/SearchCondition.vue';
import ReportResult from '@/view/eventManagement/informationDisposal/SystemReport/components/ReportResult/ReportResult.vue';
import ReportEvent from '@/view/eventManagement/informationDisposal/SystemReport/components/ReportEvent/ReportEvent.vue';
import bus from '@/views/common/js/eventBus';
import { sectionToChinese, getRelations, deepCompare } from '@/assets/js/yz_common.js';
import eventMixin from '@/view/eventManagement/informationDisposal/SystemReport/assets/js/event.js';

export default {
  name: 'SystemReport',
  components: {
    SearchCondition,
    ReportResult,
    ReportEvent,
  },
  mixins: [eventMixin],
  data() {
    return {
      isSendSite: false,
      eventDealList: [], // 事件续报
      pageSize: 10, // 每页显示条目个数
      currentPage: 1, // 页码
      searchOptions: {
        incidentTime: [], // 事发时间
        title: '', // 标题
        platformId: '', // 上报平台
      },
    };
  },
  mounted() {
    this.getEventList();
    // 删除了或者编辑了续报，要刷新数据
    bus.$on('updateEventDealList', () => {
      this.handleRefreshEvent();
    });
  },
  beforeDestroy() {
    bus.$off('updateEventDealList');
  },
  methods: {
    /**
     * @description 获取事件在列表中的页数
     */
    getEventPageNum(eventId) {
      const data = {
        eventId,
        pageSize: this.pageSize,
      };
      this.$api.getEventPageNum(data).then((res) => {
        if (res.errorcode === 0) {
          this.currentPage = res.data;
          this.$refs.reportResultRef.currentPage = res.data;
          this.handleRefreshEvent(eventId);
        }
      });
    },
    /**
     * @description 刷新数据
     */
    handleRefreshEvent(eventId) {
      const newOption = eventId ? { eventId, ...this.searchOptions } : { ...this.searchOptions };
      this.getEventList(newOption);
    },
    /**
     * @description 转到事件登记
     */
    handleToEventRegister(item) {
      this.$emit('to-event-register', item);
    },
    /**
     * @param {String} eventId 事件ID
     * @description 查询事件首报和事件续报列表
     */
    findEventDealList(eventId) {
      const data = {
        eventId, // 事件ID
      };
      this.$api.findEventDealList(data).then((res) => {
        if (res.errorcode === 0) {
          if (res.data.length > 0) {
            this.eventDealList = this.setEventDealList(res.data) || []; // 事件列表
            this.$nextTick(() => {
              this.$refs.reportEventRef.eventId = eventId;
              this.$refs.reportEventRef.eventDealList = this.eventDealList;
              this.$refs.reportEventRef.$refs.eventSwiperRef.eventDealList = this.eventDealList;
              this.$refs.reportEventRef.$refs.eventSwiperRef.clickEvent(this.eventDealList[0], 0);
              this.$refs.reportEventRef.showBottomButton = true;
            });
          } else {
            this.initEventDealData(); // 初始化数据
            this.eventDealList = []; // 清空列表
            this.$nextTick(() => {
              this.$refs.reportEventRef.eventId = eventId;
              this.$refs.reportEventRef.eventDealList = this.eventDealList;
              this.$refs.reportEventRef.$refs.eventSwiperRef.eventDealList = this.eventDealList;
              this.$refs.reportEventRef.showBottomButton = true;
            });
          }
        }
      });
    },
    /**
     * @description 分页
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleRefreshEvent();
    },
    /**
     * @description 分页
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleRefreshEvent();
    },
    /**
     * @description 表格点击行
     */
    handleRowClick(row) {
      this.findEventDealList(row.id);
    },
    /**
     * @description 点击搜索，搜索事件
     */
    searchEvent(option = {
      incidentTime: [], // 事发时间
      title: '', // 标题
      platformId: [], // 上报平台
    }) {
      this.searchOptions = option;
      this.getEventList(option);
    },
    /**
     * @description 获取事件/要情列表
     */
    getEventList(option = {
      incidentTime: [], // 事发时间
      title: '', // 标题
      platformId: [], // 平台id
    }) {
      const request = {
        method: 'post',
        baseURL: `${window.SITE_CONFIG.cloudUrl}/event`,
        url: '/eos/event/listBy',
        data: {
          beginTime: option.incidentTime && option.incidentTime.length > 0 ? option.incidentTime[0] : '', // 事发时间-开始时间
          endTime: option.incidentTime && option.incidentTime.length > 0 ? option.incidentTime[1] : '', // 事发时间-结束时间
          size: this.pageSize, // 分页-每页条数
          page: this.currentPage, // 分页-页数
          name: option.title, // 标题
          platformId: option.platformId[option.platformId.length - 1], // 下级平台id，为空则查本级和下级
          reportType: 0, // 上报列表，0为查全部
          includeLowerPlatform: 2, // 0查本级，1查本级和下级，2查下级，platformId不为空且大于0时按platformId查询
        },
      };
      this.$http(request).then((response) => {
        if (response.data.errorcode === 0) {
          this.eventDealList = response.data.data.data || [];
          if (this.eventDealList.length > 0) {
            if (option.eventId) {
              const index = this.eventDealList.findIndex((el) => el.id === option.eventId);
              this.findEventDealList(this.eventDealList[index].id);
              this.$refs.reportResultRef.setCurrentRow(this.eventDealList[index]);
            } else {
              this.findEventDealList(this.eventDealList[0].id);
            }
          }
        } else {
          this.eventDealList = [];
          this.$message.error(`获取事件列表失败，错误代码${response.data.errorcode}，错误信息：${response.data.msg}`);
        }
        this.$refs.reportResultRef.tableData = this.eventDealList;
        this.$refs.reportResultRef.total = response.data.data.totalElements;
      });
    },
  },
};
</script>

<style lang="scss">
.system-report-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  &_top {
    width: 100%;
    height: auto;
    padding: 0 10px;
    box-sizing: border-box;
  }

  &_bottom {
    width: 100%;
    height: 696px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    border-top: 1px solid #E6E6E6;
  }

  &_left {
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    border-right: 1px solid #E6E6E6;
  }

  &_right {
    width: 50%;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
