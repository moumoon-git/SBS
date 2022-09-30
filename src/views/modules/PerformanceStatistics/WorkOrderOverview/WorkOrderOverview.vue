<!--
 * @Author: liukanglin
 * @Date: 2020-12-01 14:31:45
 * @LastEditors: Liukanglin
 * @LastEditTime: 2021-01-05 17:53:46
 * @Desc: 工单总览
 * @FilePath: /SBS/src/views/modules/PerformanceStatistics/WorkOrderOverview/WorkOrderOverview.vue
-->
<template>
  <div class="work-order-overview">
    <!-- 工单总览头部 -->
    <work-order-overview-header
      ref="overviewHeader"
      :work-order-overview-header-left-data="workOrderOverviewHeaderLeftData"
      :work-order-overview-header-right-data="workOrderOverviewHeaderRightData"
      @change-date="changeDate"
    />
    <div class="overview__content">
      <!-- 工单总览表格 -->
      <work-order-overview-table
        ref="overviewTable"
        :work-order-overview-table-data="workOrderOverviewTableData"
        @get-table-list="workOrderContactorCount"
      />
      <!-- 工单总览排行 -->
      <work-order-overview-ranking
        ref="overviewRanking"
        :work-order-overview-header-right-data="workOrderOverviewHeaderRightData"
        :work-order-overview-table-data="workOrderOverviewTableData"
      />
    </div>
  </div>
</template>

<script>
import WorkOrderOverviewHeader from './WorkOrderOverview-header.vue';
import WorkOrderOverviewTable from './WorkOrderOverview-table.vue';
import WorkOrderOverviewRanking from './WorkOrderOverview-ranking.vue';

export default {
  components: {
    'work-order-overview-header': WorkOrderOverviewHeader,
    'work-order-overview-table': WorkOrderOverviewTable,
    'work-order-overview-ranking': WorkOrderOverviewRanking,
  },
  data() {
    return {
      workOrderOverviewHeaderLeftData: {}, // 工单总览头部左边数据
      workOrderOverviewHeaderRightData: [], // 工单总览头部右边数据
      workOrderOverviewTableData: {}, // 工单总览表格数据
      // 工单总量统计
      totalStatistics: {
        startTime: '',
        endTime: '',
      },
      // 工单类型统计
      typeStatistics: {
        startTime: '',
        endTime: '',
      },
      // 工单联系人处置响应时间
      contactorCount: {
        startTime: '',
        endTime: '',
        search: '',
        page: 1,
        limit: 10,
      },

    };
  },
  created() {},
  mounted() {
    this.workOrderInit();
  },
  methods: {
    /**
     * @description: 工单总量统计
     */
    workOrdertotalStatistics() {
      this.$refs.overviewHeader.totalListLoading = true; // 开启加载效果
      this.$http({
        url: this.$http.adornUrl(
          '/event/eventinfo/eventTotalHandleFinishCount',
        ),
        methods: 'get',
        params: this.$http.adornParams({
          startTime: this.totalStatistics.startTime,
          endTime: this.totalStatistics.endTime,
        }),
      }).then((data) => {
        if (data.data.code === 0) {
          // console.log('工单总量',data);
          this.workOrderOverviewHeaderLeftData = data.data.data;
          this.$refs.overviewHeader.totalListLoading = false; // 关闭加载效果
        }
      });
    },
    /**
     * @description: 工单类型统计
     */
    workOrderTypeStatistics() {
      this.$refs.overviewRanking.typeLoading = true; // 开启加载效果
      this.$refs.overviewHeader.typeListLoading = true; // 开启加载效果
      this.$http({
        url: this.$http.adornUrl('/event/eventinfo/eventTypeCount'),
        method: 'get',
        params: this.$http.adornParams({
          startTime: this.typeStatistics.startTime,
          endTime: this.typeStatistics.endTime,
        }),
      }).then((data) => {
        if (data.data.code === 0) {
          // console.log('工单类型',data);
          this.workOrderOverviewHeaderRightData = data.data.data;
          this.$refs.overviewRanking.typeLoading = false; // 关闭加载效果
          this.$refs.overviewHeader.typeListLoading = false; // 关闭加载效果
        }
      });
    },
    /**
     * @description: 工单联系人处置响应时间
     * @param {Object} tableData 表单数据
     */
    workOrderContactorCount(tableData) {
      this.$refs.overviewTable.tableLoading = true; // 开启加载效果
      this.$refs.overviewRanking.deelLoading = true; // 开启加载效果
      if (tableData) {
        // this.contactorCount = {...tableData}
        Object.assign(this.contactorCount, tableData);
      }
      this.$http({
        url: this.$http.adornUrl('/event/eventinfo/contactorCount'),
        method: 'get',
        params: this.$http.adornParams({
          startTime: this.contactorCount.startTime,
          endTime: this.contactorCount.endTime,
          search: this.contactorCount.search,
          page: this.contactorCount.page,
          limit: this.contactorCount.limit,
        }),
      }).then((data) => {
        if (data.data.code === 0) {
        // console.log('工单表格',data);
          this.workOrderOverviewTableData = data.data.data;
          this.$refs.overviewTable.tableLoading = false; // 关闭加载效果
          this.$refs.overviewRanking.deelLoading = false; // 关闭加载效果
        }
      });
    },
    /**
     * @description: 工单初始化
     */
    workOrderInit() {
      this.workOrdertotalStatistics();
      this.workOrderTypeStatistics();
      this.workOrderContactorCount();
    },
    /**
     * @description: 改变日期
     * @param {Array} date 返回来的日期
     */
    changeDate(date) {
      [this.totalStatistics.startTime, this.totalStatistics.endTime] = date;
      [this.typeStatistics.startTime, this.typeStatistics.endTime] = date;
      [this.contactorCount.startTime, this.contactorCount.endTime] = date;
      this.workOrderInit();
      // console.log(date);
    },
  },
};
</script>

<style lang="less" scoped>
  .work-order-overview {
    .overview__content {
      display: flex;
      margin-top: 10px;
    }
  }
</style>
