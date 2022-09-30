<!--
 * @Author: liukanglin
 * @Date: 2020-12-02 13:38:50
 * @LastEditors: Liukanglin
 * @LastEditTime: 2021-01-05 19:48:45
 * @Desc: 工单排行
 * @FilePath: /SBS/src/views/modules/PerformanceStatistics/WorkOrderOverview/WorkOrderOverview-ranking.vue
-->
<template>
  <div class="work-order-overview-ranking">
    <!-- 工单类型排行 -->
    <div
      v-loading="typeLoading"
      class="ranking__type"
      element-loading-spinner="sv-loading"
    >
      <!-- 类型排行头==部 -->
      <div class="ranking__type__header">
        <div>工单类型排行</div>
        <sv-select
          v-model="typeRankingSelect"
          :options="typeRankingOptions"
          @change="changeRankingType(typeRankingSelect,'type')"
        />
      </div>
      <el-table
        v-if="rankingTypeIndex == '0'"
        ref="table"
        :data="workOrderOverviewHeaderRightData"
        class="ranking__type__table"
        :default-sort="{prop: 'ratio', order: 'descending'}"
      >
        <template slot="empty">
          <img
            class="sv-table__empty"
            alt="暂无数据"
            src="./Image/table_empty.svg"
          >
          <p>暂无数据</p>
        </template>
        <el-table-column
          label=""
          type="index"
          header-align="center"
          align="center"
          width="50px"
        >
          <template slot-scope="scoped">
            <span :class="`ranking_item_${scoped.$index + 1}`">
              {{ scoped.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="typeId"
          label="工单类型"
          align="center"
          header-align="center"
          width="100px"
        >
          <template slot-scope="scoped">
            <span v-if="scoped.row.typeId == '3'">人员预警</span>
            <span v-if="scoped.row.typeId == '4'">车辆预警</span>
            <span v-if="scoped.row.typeId == '6'">学校隐患</span>
            <span v-if="scoped.row.typeId == '5'">小区隐患</span>
            <span v-if="scoped.row.typeId == '8'">违规预警</span>
            <span v-if="scoped.row.typeId == '9'">视频巡查</span>
            <span v-if="scoped.row.typeId == '10'">巡查发现</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          label="数量"
          align="center"
          header-align="center"
          width="114px"
        >
          <template slot-scope="scope">
            {{ scope.row.total ? scope.row.total : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ratio"
          label="占比"
          align="center"
          sortable
          header-align="center"
          width="114px"
        >
          <template slot-scope="scope">
            {{ scope.row.ratio ? `${parseFloat(scope.row.ratio).toFixed(2)}%` : "—" }}
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="rankingTypeIndex == '1'"
        ref="table"
        :data="workOrderOverviewHeaderRightData"
        class="ranking__type__table"
        :default-sort="{prop: 'avghandleTime', order: 'descending'}"
      >
        <template slot="empty">
          <img
            class="sv-table__empty"
            alt="暂无数据"
            src="./Image/table_empty.svg"
          >
          <p>暂无数据</p>
        </template>
        <el-table-column
          label=""
          type="index"
          header-align="center"
          align="center"
          width="50px"
        >
          <template slot-scope="scoped">
            <span :class="`ranking_item_${scoped.$index + 1}`">
              {{ scoped.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="typeId"
          label="工单类型"
          align="center"
          header-align="center"
          width="100px"
        >
          <template slot-scope="scoped">
            <span v-if="scoped.row.typeId == '3'">人员预警</span>
            <span v-if="scoped.row.typeId == '4'">车辆预警</span>
            <span v-if="scoped.row.typeId == '6'">学校隐患</span>
            <span v-if="scoped.row.typeId == '5'">小区隐患</span>
            <span v-if="scoped.row.typeId == '8'">违规预警</span>
            <span v-if="scoped.row.typeId == '9'">视频巡查</span>
            <span v-if="scoped.row.typeId == '10'">巡查发现</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="avghandleTime"
          label="平均处理时效（小时）"
          align="center"
          sortable
          header-align="center"
          width="228px"
        >
          <template slot-scope="scope">
            {{ scope.row.avghandleTime ? scope.row.avghandleTime : "—" }}
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="rankingTypeIndex == '2'"
        ref="table"
        :data="workOrderOverviewHeaderRightData"
        class="ranking__type__table"
        :default-sort="{prop: 'avgResponseTime', order: 'descending'}"
      >
        <template slot="empty">
          <img
            class="sv-table__empty"
            alt="暂无数据"
            src="./Image/table_empty.svg"
          >
          <p>暂无数据</p>
        </template>
        <el-table-column
          label=""
          type="index"
          header-align="center"
          align="center"
          width="50px"
        >
          <template slot-scope="scoped">
            <span :class="`ranking_item_${scoped.$index + 1}`">
              {{ scoped.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="typeId"
          label="工单类型"
          align="center"
          header-align="center"
          width="100px"
        >
          <template slot-scope="scoped">
            <span v-if="scoped.row.typeId == '3'">人员预警</span>
            <span v-if="scoped.row.typeId == '4'">车辆预警</span>
            <span v-if="scoped.row.typeId == '6'">学校隐患</span>
            <span v-if="scoped.row.typeId == '5'">小区隐患</span>
            <span v-if="scoped.row.typeId == '8'">违规预警</span>
            <span v-if="scoped.row.typeId == '9'">视频巡查</span>
            <span v-if="scoped.row.typeId == '10'">巡查发现</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="avgResponseTime"
          label="平均响应时间（小时）"
          align="center"
          sortable
          header-align="center"
          width="228px"
        >
          <template slot-scope="scope">
            {{ scope.row.avgResponseTime ? scope.row.avgResponseTime : "—" }}
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="rankingTypeIndex == '3'"
        ref="table"
        :data="workOrderOverviewHeaderRightData"
        class="ranking__type__table"
        :default-sort="{prop: 'responseRatio', order: 'descending'}"
      >
        <template slot="empty">
          <img
            class="sv-table__empty"
            alt="暂无数据"
            src="./Image/table_empty.svg"
          >
          <p>暂无数据</p>
        </template>
        <el-table-column
          label=""
          type="index"
          header-align="center"
          align="center"
          width="50px"
        >
          <template slot-scope="scoped">
            <span :class="`ranking_item_${scoped.$index + 1}`">
              {{ scoped.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="typeId"
          label="工单类型"
          align="center"
          header-align="center"
          width="100px"
        >
          <template slot-scope="scoped">
            <span v-if="scoped.row.typeId == '3'">人员预警</span>
            <span v-if="scoped.row.typeId == '4'">车辆预警</span>
            <span v-if="scoped.row.typeId == '6'">学校隐患</span>
            <span v-if="scoped.row.typeId == '5'">小区隐患</span>
            <span v-if="scoped.row.typeId == '8'">违规预警</span>
            <span v-if="scoped.row.typeId == '9'">视频巡查</span>
            <span v-if="scoped.row.typeId == '10'">巡查发现</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="responseNumber"
          label="已响应"
          align="center"
          header-align="center"
          width="70px"
        >
          <template slot-scope="scope">
            {{ scope.row.responseNumber ? scope.row.responseNumber : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="unResponseNumber"
          label="未响应"
          align="center"
          header-align="center"
          width="70px"
        >
          <template slot-scope="scope">
            {{ scope.row.unResponseNumber ? scope.row.unResponseNumber : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="responseRatio"
          label="响应率"
          align="center"
          sortable
          header-align="center"
          width="88px"
        >
          <template slot-scope="scope">
            {{ scope.row.responseRatio ?
              `${parseFloat(scope.row.responseRatio).toFixed(2)}%` : "—" }}
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="rankingTypeIndex == '4'"
        ref="table"
        :data="workOrderOverviewHeaderRightData"
        class="ranking__type__table"
        :default-sort="{prop: 'handleRatio', order: 'descending'}"
      >
        <template slot="empty">
          <img
            class="sv-table__empty"
            alt="暂无数据"
            src="./Image/table_empty.svg"
          >
          <p>暂无数据</p>
        </template>
        <el-table-column
          label=""
          type="index"
          header-align="center"
          align="center"
          width="50px"
        >
          <template slot-scope="scoped">
            <span :class="`ranking_item_${scoped.$index + 1}`">
              {{ scoped.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="typeId"
          label="工单类型"
          align="center"
          header-align="center"
          width="100px"
        >
          <template slot-scope="scoped">
            <span v-if="scoped.row.typeId == '3'">人员预警</span>
            <span v-if="scoped.row.typeId == '4'">车辆预警</span>
            <span v-if="scoped.row.typeId == '6'">学校隐患</span>
            <span v-if="scoped.row.typeId == '5'">小区隐患</span>
            <span v-if="scoped.row.typeId == '8'">违规预警</span>
            <span v-if="scoped.row.typeId == '9'">视频巡查</span>
            <span v-if="scoped.row.typeId == '10'">巡查发现</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="handleNumber"
          label="已处置"
          align="center"
          header-align="center"
          width="70px"
        >
          <template slot-scope="scope">
            {{ scope.row.handleNumber ? scope.row.handleNumber : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="unhandleNumber"
          label="未处置"
          align="center"
          header-align="center"
          width="70px"
        >
          <template slot-scope="scope">
            {{ scope.row.unhandleNumber ? scope.row.unhandleNumber : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="handleRatio"
          label="处置率"
          align="center"
          sortable
          header-align="center"
          width="88px"
        >
          <template slot-scope="scope">
            {{ scope.row.handleRatio ? `${parseFloat(scope.row.handleRatio).toFixed(2)}%` : "—" }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 工单处置排行 -->
    <div
      v-loading="deelLoading"
      class="ranking__deel"
      element-loading-spinner="sv-loading"
    >
      <div class="ranking__deel__header">
        <div>工单处置排行</div>
        <sv-select
          v-model="deelRankingSelect"
          :options="deelRankingOptions"
          @change="changeRankingType(deelRankingSelect,'deel')"
        />
      </div>
      <el-table
        v-if="rankingDeelIndex == '0'"
        ref="table"
        :data="workOrderOverviewTableData.list"
        class="ranking__deel__table"
        :default-sort="{prop: 'ratio', order: 'descending'}"
      >
        <template slot="empty">
          <img
            class="sv-table__empty"
            alt="暂无数据"
            src="./Image/table_empty.svg"
          >
          <p>暂无数据</p>
        </template>
        <el-table-column
          label=""
          type="index"
          header-align="center"
          align="center"
          width="50px"
        >
          <template slot-scope="scoped">
            <span :class="`ranking_item_${scoped.$index + 1}`">
              {{ scoped.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          header-align="center"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.row.name ? scope.row.name : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="eventNumber"
          label="数量"
          align="center"
          header-align="center"
          width="114px"
        >
          <template slot-scope="scope">
            {{ scope.row.eventNumber ? scope.row.eventNumber : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ratio"
          label="占比"
          align="center"
          sortable
          header-align="center"
          width="114px"
        >
          <template slot-scope="scope">
            {{ scope.row.ratio ? `${parseFloat(scope.row.ratio).toFixed(2)}%` : "—" }}
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="rankingDeelIndex == '1'"
        ref="table"
        :data="workOrderOverviewTableData.list"
        class="ranking__deel__table"
        :default-sort="{prop: 'avghandleTime', order: 'descending'}"
      >
        <template slot="empty">
          <img
            class="sv-table__empty"
            alt="暂无数据"
            src="./Image/table_empty.svg"
          >
          <p>暂无数据</p>
        </template>
        <el-table-column
          label=""
          type="index"
          header-align="center"
          align="center"
          width="50px"
        >
          <template slot-scope="scoped">
            <span :class="`ranking_item_${scoped.$index + 1}`">
              {{ scoped.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          header-align="center"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.row.name ? scope.row.name : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="avghandleTime"
          label="平均处理时效（小时）"
          align="center"
          sortable
          header-align="center"
          width="228px"
        >
          <template slot-scope="scope">
            {{ scope.row.avghandleTime ? scope.row.avghandleTime : "—" }}
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="rankingDeelIndex == '2'"
        ref="table"
        :data="workOrderOverviewTableData.list"
        class="ranking__deel__table"
        :default-sort="{prop: 'avgResponseTime', order: 'descending'}"
      >
        <template slot="empty">
          <img
            class="sv-table__empty"
            alt="暂无数据"
            src="./Image/table_empty.svg"
          >
          <p>暂无数据</p>
        </template>
        <el-table-column
          label=""
          type="index"
          header-align="center"
          align="center"
          width="50px"
        >
          <template slot-scope="scoped">
            <span :class="`ranking_item_${scoped.$index + 1}`">
              {{ scoped.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          header-align="center"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.row.name ? scope.row.name : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="avgResponseTime"
          label="平均响应时间（小时）"
          align="center"
          sortable
          header-align="center"
          width="228px"
        >
          <template slot-scope="scope">
            {{ scope.row.avgResponseTime ? scope.row.avgResponseTime : "—" }}
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="rankingDeelIndex == '3'"
        ref="table"
        :data="workOrderOverviewTableData.list"
        class="ranking__deel__table"
        :default-sort="{prop: 'responseRatio', order: 'descending'}"
      >
        <template slot="empty">
          <img
            class="sv-table__empty"
            alt="暂无数据"
            src="./Image/table_empty.svg"
          >
          <p>暂无数据</p>
        </template>
        <el-table-column
          label=""
          type="index"
          header-align="center"
          align="center"
          width="50px"
        >
          <template slot-scope="scoped">
            <span :class="`ranking_item_${scoped.$index + 1}`">
              {{ scoped.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          header-align="center"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.row.name ? scope.row.name : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="responseNumber"
          label="已响应"
          align="center"
          header-align="center"
          width="70px"
        >
          <template slot-scope="scope">
            {{ scope.row.responseNumber ? scope.row.responseNumber : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="unResponseNumber"
          label="未响应"
          align="center"
          header-align="center"
          width="70px"
        >
          <template slot-scope="scope">
            {{ scope.row.unResponseNumber ? scope.row.unResponseNumber : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="responseRatio"
          label="响应率"
          align="center"
          sortable
          header-align="center"
          width="88px"
        >
          <template slot-scope="scope">
            {{ scope.row.responseRatio ?
              `${parseFloat(scope.row.responseRatio).toFixed(2)}%` : "—" }}
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="rankingDeelIndex == '4'"
        ref="table"
        :data="workOrderOverviewTableData.list"
        class="ranking__deel__table"
        :default-sort="{prop: 'handleRatio', order: 'descending'}"
      >
        <template slot="empty">
          <img
            class="sv-table__empty"
            alt="暂无数据"
            src="./Image/table_empty.svg"
          >
          <p>暂无数据</p>
        </template>
        <el-table-column
          label=""
          type="index"
          header-align="center"
          align="center"
          width="50px"
        >
          <template slot-scope="scoped">
            <span :class="`ranking_item_${scoped.$index + 1}`">
              {{ scoped.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          header-align="center"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.row.name ? scope.row.name : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="handleNumber"
          label="已处置"
          align="center"
          header-align="center"
          width="70px"
        >
          <template slot-scope="scope">
            {{ scope.row.handleNumber ? scope.row.handleNumber : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="unhandleNumber"
          label="未处置"
          align="center"
          header-align="center"
          width="70px"
        >
          <template slot-scope="scope">
            {{ scope.row.unhandleNumber ? scope.row.unhandleNumber : "—" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="handleRatio"
          label="处置率"
          align="center"
          sortable
          header-align="center"
          width="88px"
        >
          <template slot-scope="scope">
            {{ scope.row.handleRatio ? `${parseFloat(scope.row.handleRatio).toFixed(2)}%` : "—" }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    workOrderOverviewHeaderRightData: {
      type: Array,
      default: () => ([]),
    },
    workOrderOverviewTableData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      rankingTypeIndex: 0,
      rankingDeelIndex: 0,
      // 类型排行数据请求中
      typeLoading: false,
      // 处置排行数据请求中
      deelLoading: false,
      workOrderType: {
        total: [], // 数量
        avghandleTime: [], // 处理时效
        avgResponseTime: [], // 响应时间
        responseRatio: [], // 响应率
        handleRatio: [], // 处置率
      },
      typeRankingSelect: '', // 类型排行绑定值
      typeRankingOptions: [
        {
          value: 0,
          label: '数量',
        }, {
          value: 1,
          label: '处理时效',
        }, {
          value: 2,
          label: '响应时间',
        }, {
          value: 3,
          label: '响应率',
        }, {
          value: 4,
          label: '处置率',
        },
      ], // 类型排行选项
      deelRankingSelect: '', // 处置排行绑定值
      deelRankingOptions: [
        {
          value: 0,
          label: '数量',
        }, {
          value: 1,
          label: '处理时效',
        }, {
          value: 2,
          label: '响应时间',
        }, {
          value: 3,
          label: '响应率',
        }, {
          value: 4,
          label: '处置率',
        },
      ], // 处置排行选项
    };
  },
  methods: {
    /**
     * @description: description
     * @param {String} index
     * @param {String} flag
     */
    changeRankingType(index, flag) {
      // 工单类型排行点击删除按钮
      if (index === '' && flag === 'type') {
        this.rankingTypeIndex = 0;
      } else if (index === '' && flag === 'deel') {
        // 工单处置排行点击删除按钮
        this.rankingDeelIndex = 0;
      } else if (flag === 'type') {
        // 工单类型排行
        this.rankingTypeIndex = index;
      } else if (flag === 'deel') {
        // 工单处置排行
        this.rankingDeelIndex = index;
      }
    },
  },
  mounted() {
  },
};
</script>
<style lang="less" scoped>
  .work-order-overview-ranking {
    margin-left: 10px;
    width: 375px;
    // height: 550px;
    height: calc(100vh - 385px);
    // background-color: #ffffff;
    border-radius: 4px;
    // 工单类型排行
    .ranking__type {
      // height: 270px;
      height: calc(50% - 5px);
      margin-bottom: 10px;
      border-radius: 4px;
      background-color: #ffffff;
      box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
      overflow: hidden;
      // 类型排行头部
      .ranking__type__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        .sv-select{
          height: 30px !important;
          margin-right: 10px !important;
        }
        > div {
          &:nth-child(1) {
            font-size: 16px;
            height: 16px;
            line-height: 16px;
            border-left: 3px solid #15a6fc;
            margin-left: 20px;
            padding-left: 10px;
          }
          &:nth-last-child(1) {
            height: 50px;
            padding: 5px 0;
            box-sizing: border-box;
            display: flex;
            span {
              display: inline-block;
              width: 40px;
              height: 40px;
              background-color: #f4f4f4;
              text-align: center;
              margin-right: 10px;
              &:hover {
                cursor: pointer;
              }
              &:nth-child(1) {
                line-height: 40px;
              }
            }
          }
        }
        &--active {
          background-color: aqua !important;
        }
      }
      // 处理表格样式
    /deep/ .el-table::before {
      display: none;
    }
    /deep/ .el-table {
      height: calc(100% - 50px);
      box-shadow: none !important;
      border: none;
      max-width: none;
      thead {
        th {
          height: 40px;
          border-bottom: none;
          div {
            font-size: 14px;
            font-weight: bold;
            color: #333333;
          }
        }
      }
      tbody {
        div,
        td {
          font-size: 14px;
          font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC",
            Roboto-Regular, SourceHanSansCN-Regular;
          font-weight: normal;
          color: #666666;
        }
        td {
          min-height: 40px;
          height: 40px;
          border-left: none;
          border-right: none;
          .cell {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            white-space: normal;
          }
        }
        tr {
          background: none;
          &:nth-child(1){
            td{
              &:nth-child(1){
                div{
                  span{
                  width: 23px;
                  height: 23px;
                  display: inline-block;
                  border-radius: 50%;
                  color: white;
                  background-color: #F56A6A;
                  }
                }
              }
            }
          }
          &:nth-child(2){
            td{
              &:nth-child(1){
              div{
                span{
                  width: 23px;
                  height: 23px;
                  display: inline-block;
                  border-radius: 50%;
                  color: white;
                  background-color: #FF8E7A;
                }
              }
              }
            }
          }
          &:nth-child(3){
            td{
              &:nth-child(1){
              div{
                span{
                  width: 23px;
                  height: 23px;
                  display: inline-block;
                  border-radius: 50%;
                  color: white;
                  background-color: #FFBE72;
                }
              }
              }
            }
          }
        }
        tr:hover {
          box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1);
          & > td:nth-child(1) {
            border-left: 3px solid #0091ff;
          }
        }
      }
      // 暂无数据
      .sv-table__empty {
        width: 123px;
        height: 123px;
        position: relative;
        left: -7px;
        margin-bottom: 4px;
        & + p {
          color: #cad5e8;
          font-size: 14px;
          line-height: 14px;
        }
      }
    }
      // 设置鼠标移入时才出现滚动条
     /deep/ .el-table--scrollable-x .el-table__body-wrapper{
        height: calc(100% - 50px);
        // height: 167px;
        overflow-y: hidden;
        overflow-x: hidden;
        &:hover{
        overflow-y: auto;
        }
      }
      // 类型排行内容区
      .ranking__type__content {
        // height: 225px;
        height: 200px;
        overflow-y: scroll;
        &__title {
          height: 50px;
          background-color: #f9fcff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          > div {
            flex-shrink: 0;
            flex-basis: 75px;
            text-align: center;
          }
        }
        &__list {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          box-sizing: border-box;
          > div {
            flex-shrink: 0;
            flex-basis: 75px;
            text-align: center;
            span{
              text-align: center;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              display: inline-block;
            }
            .firstColor{
              color: white;
              background-color: #F56A6A;
            }
            .secondColor{
              color: white;
              background-color: #FF8E7A;
            }
            .thirdColor{
              color: white;
              background-color: #FFBE72;
            }
          }
        }
      }
    }
    // 工单处置排行
    .ranking__deel {
      // height: 270px;
      height: calc(50% - 5px);
      border-radius: 4px;
      background-color: #ffffff;
      box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
      overflow: hidden;
      // 处置排行头部
      .ranking__deel__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        .sv-select{
          height: 30px !important;
          margin-right: 10px !important;
        }
        > div {
          &:nth-child(1) {
            font-size: 16px;
            height: 16px;
            line-height: 16px;
            border-left: 3px solid #15a6fc;
            margin-left: 20px;
            padding-left: 10px;
          }
          &:nth-last-child(1) {
            height: 50px;
            padding: 5px 0;
            box-sizing: border-box;
            display: flex;
            span {
              display: inline-block;
              width: 40px;
              height: 40px;
              background-color: #f4f4f4;
              text-align: center;
              margin-right: 10px;
              &:hover {
                cursor: pointer;
              }
              &:nth-child(1) {
                line-height: 40px;
              }
            }
          }
        }
        &--active {
          background-color: aqua !important;
        }
      }
      // 处理表格样式
      /deep/ .el-table::before {
        display: none;
      }
      /deep/ .el-table {
        height: calc(100% - 50px);
        box-shadow: none !important;
        border: none;
        max-width: none;
        thead {
          th {
            height: 40px;
            border-bottom: none;
            div {
              font-size: 14px;
              font-weight: bold;
              color: #333333;
            }
          }
        }
        tbody {
          div,
          td {
            font-size: 14px;
            font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC",
              Roboto-Regular, SourceHanSansCN-Regular;
            font-weight: normal;
            color: #666666;
          }
          td {
            min-height: 40px;
            height: 40px;
            border-left: none;
            border-right: none;
            .cell {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              /*! autoprefixer: off */
              -webkit-box-orient: vertical;
              /* autoprefixer: on */
              white-space: normal;
            }
          }
          tr {
            background: none;
            &:nth-child(1){
              td{
                &:nth-child(1){
                  div{
                    span{
                    width: 23px;
                    height: 23px;
                    display: inline-block;
                    border-radius: 50%;
                    color: white;
                    background-color: #F56A6A;
                    }
                  }
                }
              }
            }
            &:nth-child(2){
              td{
                &:nth-child(1){
                div{
                  span{
                    width: 23px;
                    height: 23px;
                    display: inline-block;
                    border-radius: 50%;
                    color: white;
                    background-color: #FF8E7A;
                  }
                }
                }
              }
            }
            &:nth-child(3){
              td{
                &:nth-child(1){
                div{
                  span{
                    width: 23px;
                    height: 23px;
                    display: inline-block;
                    border-radius: 50%;
                    color: white;
                    background-color: #FFBE72;
                  }
                }
                }
              }
            }
          }
          tr:hover {
            box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1);
            & > td:nth-child(1) {
              border-left: 3px solid #0091ff;
            }
          }
        }
        // 暂无数据
        .sv-table__empty {
          width: 123px;
          height: 123px;
          position: relative;
          left: -7px;
          margin-bottom: 4px;
          & + p {
            color: #cad5e8;
            font-size: 14px;
            line-height: 14px;
          }
        }
      }
      // 设置鼠标移入时才出现滚动条
       /deep/ .el-table--scrollable-x .el-table__body-wrapper{
          height: calc(100% - 50px);
          // height: 167px;
          overflow-y: hidden;
          overflow-x: hidden;
          &:hover{
          overflow-y: auto;
          }
        }
      // 处置排行内容区
      .ranking__deel__content {
        // height: 225px;
        height: 200px;
        overflow-y: scroll;
        &__title {
          height: 50px;
          background-color: #f9fcff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          > div {
            flex-shrink: 0;
            flex-basis: 75px;
            text-align: center;
          }
        }
        &__list {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          box-sizing: border-box;
          > div {
            flex-shrink: 0;
            flex-basis: 75px;
            text-align: center;
          }
            span{
              text-align: center;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              display: inline-block;
            }
            .firstColor{
              color: white;
              background-color: #F56A6A;
            }
            .secondColor{
              color: white;
              background-color: #FF8E7A;
            }
            .thirdColor{
              color: white;
              background-color: #FFBE72;
            }
        }
      }
    }
  }
</style>
