<!--
 * @Author: your name
 * @Date: 2021-08-18 15:53:20
 * @LastEditTime: 2021-08-20 10:52:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\eventTrendAnalysis.vue
-->
<template>
  <div>
    <div class="operation_bar">
      <div style="display: flex; justify-content: flex-start; width: 620px">
        <template>
          <label class="export">区域</label>
          <select-tree
            class="selectTree"
            @getChecked="getChecked"
            ref="selectTree"
            style="margin-left: 10px"
          ></select-tree>
        </template>
        <div class="common_style">
          <label class="export">事件类型</label>
          <event-type
            class="selectTree"
            @getEvenTypeData="getEvenTypeData"
            ref="eventType"
          ></event-type>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <template>
          <label class="export">分组方式</label>
          <el-select
            v-model="exportLog"
            placeholder="请选择"
            style="margin-left: 10px"
            @change="exportLogData"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item"
            >
            </el-option>
          </el-select>
        </template>
        <div class="common_style">
          <!-- 按选择分组方式显示日期选择组件-->
          <!-- 日-->
          <el-date-picker
            :picker-options="pickerOptions"
            format="yyyy-MM-dd"
            :clearable="false"
            value-format="yyyy-MM-dd"
            v-show="showValue"
            v-model="value"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <!-- 周-->
          <el-date-picker
            :picker-options="pickerOptions"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-show="showWekk"
            v-model="wekkValue"
            :clearable="false"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <!--月-->
          <el-date-picker
            v-model="monthData"
            format="yyyy-MM"
            :clearable="false"
            value-format="yyyy-MM"
            type="monthrange"
            v-show="showMothdata"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
          >
          </el-date-picker>
          <!--年-->
          <el-date-picker
            v-show="showYearstart"
            v-model="yearStart"
            :clearable="false"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="开始年"
          >
          </el-date-picker>
          <span v-show="showYearstart">&nbsp;至&nbsp;</span>
          <el-date-picker
            v-show="showYearstart"
            v-model="yearEnd"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="结束年"
          >
          </el-date-picker>
          <!--按选择分组方式显示日期选择组件-->
        </div>
        <!-- 统计 -->
        <el-button
          type="primary"
          @click="inquire()"
          :disabled="buttonHide"
          class="common_style"
          >统计</el-button
        >
        <!-- 生成事件统计报表 -->
        <el-button type="primary" @click="exportEventTable" class="common_style"
          >生成事件统计报表</el-button
        >
      </div>
    </div>
    <div class="contentStyle">
      <!-- 折线图 -->
      <div class="echarts">
        <echarts-event-statistics
          :id="idOne"
          :width="width"
          :height="height"
          :color-list="colorList"
          ref="echartsEventStatistics"
        ></echarts-event-statistics>
      </div>
      <!-- 柱状图 -->
      <div class="echarts">
        <echarts-columnar
          :id="idTwo"
          :width="width"
          :height="height"
          :color-list="colorList"
          ref="echartsColumnar"
        ></echarts-columnar>
      </div>
    </div>
  </div>
</template>

<script>
import echartsEventStatistics from "./echartsEventStatistics";
import echartsColumnar from "./echartsColumnar";
import selectTree from "./selectTree";
import eventType from "./eventType";
import Cookies from "js-cookie";
import { Url, daysInMonth } from "@/assets/js/common";
const downLoadFile = require('@/utils/downloadFile.js').default;
export default {
  name: "eventInformation",
  components: {
    echartsEventStatistics,
    echartsColumnar,
    selectTree,
    eventType,
  },
  data() {
    return {
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime();
          if (maxDate) {
            this.pickerMinDate = "";
          }
        },
        disabledDate: (time) => {
          if (this.pickerMinDate !== "") {
            let one = 30 * 24 * 3600 * 1000;
            let minTime = this.pickerMinDate - one;
            let maxTime = this.pickerMinDate + one;
            if (maxTime > new Date()) {
              maxTime = new Date();
            }
            return time.getTime() < minTime || time.getTime() > maxTime;
          }
          return time.getTime() > Date.now();
        },
      },
      gutter: 24,
      width: "100%",
      height: "330px",
      idOne: "idOne",
      idTwo: "idTwo",
      maxDate: 10, //Y轴最大值
      lineXdata: [], //折线X轴数据
      lineSeries: [], //折线echarts数据
      legendData: [],
      barXdata: [], //柱形X轴数据
      barSeries: [], //柱形echarts数据
      options: [
        {
          value: "0",
          label: "按日",
        },
        {
          value: "1",
          label: "按周",
        },
        {
          value: "2",
          label: "按月",
        },
        {
          value: "3",
          label: "按年",
        },
      ], //分组数据
      exportLog: {
        //选中分组
        value: "2",
        label: "按月",
      }, //
      showValue: false, //日日期是否显示
      showWekk: false, //周日期是否显示
      showMothdata: false, //月日期是否显示
      showYearstart: false, //年日期是否显示
      value: "", //日日期
      wekkValue: "", //周日期
      monthData: "", //月日期查询
      yearStart: "", //开始年
      yearEnd: "", //结束年

      areaSubdata: "", //区域下拉树组件数据
      eventypedata: [], //事件类型子组件数据

      buttonHide: false,
      colorList: [
        "#8196FF",
        "#FF6E88",
        "#FEBB59",
        "#FFE658",
        "#c23531",
        "#2f4554",
        "#61a0a8",
        "#FFD7DB",
        "#d48265",
        "#91c7ae",
        "#749f83",
        "#ca8622",
        "#bda29a",
        "#6e7074",
        "#546570",
        "#c4ccd3",
      ], // 图形遍历的颜色
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.exportLogData();
    });
  },
  created() {
    this.getTime();
    this.sendInquire();
  },
  methods: {
    getNowMonthDate(time, type) {
      let date = new Date(time);
      let year = date.getFullYear() + "";
      let month = date.getMonth() + 1 + "";
      if (type == "star") {
        // 本月第一天日期
        let begin = year + "-" + month;
        return `${begin}-01`;
      }
      if (type == "end") {
        // 本月最后一天日期
        let lastDateOfCurrentMonth = new Date(year, month, 0);
        let end = year + "-" + month + "-" + lastDateOfCurrentMonth.getDate();
        return end;
      }
    },
    //生成事件统计报表
    exportEventTable() {
      let type = this.exportLog.value;
      //type 0=>日 1=>周 2=>月 3=>年
      let star, end;
      switch (type) {
        case "0":
          if (this.value == "" || this.value == null) {
            this.$message({
              message: "请选择时间再导出",
              type: "warning",
            });
            return;
          }
          star = this.value[0];
          end = this.value[1];
          break;
        case "1":
          if (this.wekkValue == "" || this.wekkValue == null) {
            this.$message({
              message: "请选择时间再导出",
              type: "warning",
            });
            return;
          }
          star = this.wekkValue[0];
          end = this.wekkValue[1];
          break;
        case "2":
          if (this.monthData == "" || this.monthData == null) {
            this.$message({
              message: "请选择时间再导出",
              type: "warning",
            });
            return;
          }
          star = this.getNowMonthDate(this.monthData[0], "star");
          end = this.getNowMonthDate(this.monthData[1], "end");
          break;
        case "3":
          if (
            this.yearStart == "" ||
            this.yearStart == null ||
            this.yearEnd == "" ||
            this.yearEnd == null
          ) {
            this.$message({
              message: "请选择时间再导出",
              type: "warning",
            });
            return;
          }
          star = `${this.yearStart}-01-31`;
          end = `${this.yearEnd}-12-31`;
          break;
      }
      const request = {
        method: 'get',
        url: `/eos/statistics/eventStatController/eventExcel?areaId=${this.areaSubdata == null ? 0 : this.areaSubdata}&&caseId=${this.eventypedata == null ? 0 : this.eventypedata}&&startTime=${star}&&timeEnd=${end}`,
        baseURL: window.g.ApiUrl,
        headers: {
          token: Cookies.get('token'),
        },
        responseType: 'arraybuffer',
      };
      downLoadFile(request);
      // console.log(downLoadFile(request),"555")
      // downloadUrl = `${Url}/eos/statistics/eventStatController/eventExcel?areaId=${
      //   this.areaSubdata == null ? 0 : this.areaSubdata
      // }&&caseId=${
      //   this.eventypedata == null ? 0 : this.eventypedata
      // }&&startTime=${star}&&timeEnd=${end}`;
      // window.location.href = downloadUrl;
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2021-01-13
     * @description 获取当前月和上个月日期
     */
    getTime() {
      let date = new Date();
      let lastYear,
        lastMonth,
        startDate,
        endDate,
        year,
        month,
        startDay,
        endDay;
      year = date.getFullYear(); // 完整年
      lastYear = date.getFullYear() - 1; // 去年
      month = date.getMonth() + 1; // 当月
      // 判断当前是否为1月，为1月时，上个月为12月
      if (date.getMonth() == 0) {
        lastMonth = "12"; // 上一月
        startDate = lastYear + "-" + lastMonth; // 上个月
        startDay = startDate + "-" + "01";
      } else {
        lastMonth = date.getMonth(); // 上一月
        startDate = year + "-" + lastMonth; // 上个月
        startDay = startDate + "-" + "01";
      }
      endDate = year + "-" + month; // 当月
      endDay = endDate + "-" + daysInMonth(year, month); // 当天 daysInMonth()获取当月天数
      let monthData = [];
      monthData.push(startDay);
      monthData.push(endDay);
      this.monthData = monthData;
    },
    getEvenTypeData(arrid) {
      //获取eventypedata数据
      console.log(arrid);
      this.eventypedata = arrid;
    },
    getChecked(arrid) {
      //获取selectTreeData数据
      this.areaSubdata = arrid;
    },
    exportLogData() {
      //监听分组方式日期选择
      let type = this.exportLog.value;
      if (type == "0") {
        this.showValue = true;
        this.showWekk = false;
        this.showMothdata = false;
        this.showYearstart = false;
        return;
      } else if (type == "1") {
        this.showValue = false;
        this.showWekk = true;
        this.showMothdata = false;
        this.showYearstart = false;
        return;
      } else if (type == "2") {
        this.showValue = false;
        this.showWekk = false;
        this.showMothdata = true;
        this.showYearstart = false;
        return;
      } else if (type == "3") {
        this.showValue = false;
        this.showWekk = false;
        this.showMothdata = false;
        this.showYearstart = true;
        return;
      }
    },
    sendInquire() {
      this.lineXdata = []; //清空echarts数据
      this.lineSeries = [];
      this.barXdata = []; //清空echarts数据
      this.barSeries = [];
      if (this.eventypedata == "") {
        this.eventypedata = null;
      }
      if (this.areaSubdata == "") {
        this.areaSubdata = null;
      }
      let types = this.exportLog.value;
      let star, end, data;
      switch (types) {
        case "0":
          if (this.value == "" || this.value == null) {
            this.$message({
              message: "请先选择时间再统计",
              type: "warning",
            });
            return;
          }
          star = this.value[0];
          end = this.value[1];
          break;
        case "1":
          if (this.wekkValue == "" || this.wekkValue == null) {
            this.$message({
              message: "请先选择时间再统计",
              type: "warning",
            });
            return;
          }
          star = this.wekkValue[0];
          end = this.wekkValue[1];
          break;
        case "2":
          if (this.monthData == "" || this.monthData == null) {
            this.$message({
              message: "请先选择时间再统计",
              type: "warning",
            });
            return;
          }
          star = this.monthData[0];
          end = this.monthData[1];
          break;
        case "3":
          if (
            this.yearStart == "" ||
            this.yearStart == null ||
            this.yearEnd == "" ||
            this.yearEnd == null
          ) {
            this.$message({
              message: "请先选择时间再统计",
              type: "warning",
            });
            return;
          }
          star = this.yearStart;
          end = this.yearEnd;
          if (star > end) {
            this.$message({
              message: "结束年必须比开始年小",
              type: "warning",
            });
            return;
          }
          break;
        default:
          break;
      }
      data = {
        data: {
          startTime: star,
          timeEnd: end,
          groupType: this.exportLog.value,
          caseId: this.eventypedata,
          areaId: this.areaSubdata,
        },
      };
      this.$api.eventStat(data).then((res) => {
        this.lineXdata = res.data.time;
        this.barXdata = res.data.time;
        this.legendData = res.data.caseName;
        this.maxDate = res.data.countMax + 7; //防止直接到顶点加
        for (let i = 0; i < res.data.data.length; i++) {
          this.lineSeries.push({
            name: res.data.data[i].case,
            type: "line",
            data: res.data.data[i].count,
          });
          this.barSeries.push({
            name: res.data.data[i].case,
            type: "bar",
            data: res.data.data[i].count,
          });
        }
        this.$refs.echartsEventStatistics.drawLine(
          this.lineXdata,
          this.lineSeries,
          this.legendData,
          this.maxDate
        );
        this.$refs.echartsColumnar.drawLine(
          this.barXdata,
          this.barSeries,
          this.legendData,
          this.maxDate
        );
      });
    },
    inquire() {
      //提交查询
      console.log(this.monthData);
      this.buttonHide = true;
      setTimeout(() => {
        this.buttonHide = false;
      }, 3000);
      this.sendInquire();
    },
  },
};
</script>

<style scoped>
.operation_bar {
  min-width: 1420px;
  /* padding: 0 15px; */
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.operation_bar_left_item {
  width: 466px;
  display: flex;
}
.operation_bar_right_item {
  display: flex;
  justify-content: flex-end;
}
.navsBar {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.export {
  color: #333333;
  vertical-align: middle;
  height: 40px;
  line-height: 40px;
  display: inline-block;
  box-sizing: border-box;
  white-space: nowrap;
  font-size: 17px;
}
.areaName {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(162, 162, 162, 1);
}
.contentStyle {
  /* padding: 15px; */
  padding: 15px 0px;
}
.selectTree {
  position: relative;
}
.echarts {
  background: #ffffff;
  border-radius: 4px;
  padding: 20px 20px 0 30px;
  margin-bottom: 15px;
}
.common_style {
  margin-left: 10px;
}
</style>
